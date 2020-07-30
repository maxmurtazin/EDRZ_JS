// time
const INIT_PAUSE = 5000;
const READ_INTERVAL = 1000;

// MUX
const MUX_PIN = [A0, A1]; // analog pin connected to MUX[i]
const S_PIN = [P13, P7, P9]; // multyplex select digital pins
const MUX_INPUTS = 8; // number of inputs in one MUX

// Ethernet pins
const MOSI = B15;
const MISO = B14;
const SCK = B13;
const ETH_CONNECT_PIN = P10;

const PORT = 8080;

 pH calibration

var pH = [];
pH.push({
  id: "pHD0",
  muxId: 0,
  intercept: 0.7091,
  slope: 11.699,
  value: 0,
  lcd: {
    name: "pHD",
    id: 0,
    x: 8,
    y: 0
  }
});
pH.push({
  id: "pHC0",
  muxId: 3,
  intercept: 0.7091,
  slope: 11.699,
  value: 0,
  lcd: {
    name: "pHC",
    id: 1,
    x: 0,
    y: 0
  }
});

function readMuxDataArray(muxPin, muxInputs, sPin) {
  let muxDataArray = new Array (muxPin.length * muxInputs);
  for (let i=0; i<muxInputs; i++) {
    digitalWrite(sPin[0], i & 0x01);
    digitalWrite(sPin[1], i>>1 & 0x01);
    digitalWrite(sPin[2], i>>2 & 0x01);
    muxPin.forEach(function(pin,j){
      muxDataArray[i+j*muxInputs]=analogRead(pin);
    })
  }
  return muxDataArray;
}

function getPhFromDataArray(phArray, data) {
  phArray.forEach(function(p) {
    p.value = p.slope * data[p.muxId] + p.intercept;
  });
}

// LCD
function setupHD44780lcdScreen(i2c, sclPin, sdaPin) {
  i2c.setup({scl:sclPin, sda:sdaPin}); // connect display(pins)
  let lcd = require("HD44780").connectI2C(i2c);
  return lcd;
}

function refreshLCDs(lcds) {
  lcds.forEach(function(l) {
    l.setCursor(0,0); 
    l.print("                "); //16 spaces
    l.setCursor(0,1); 
    l.print("                "); //16 spaces
  });
}

function phToLCD(phs, lcds) {
  phs.forEach(function(p) {
    lcds[p.lcd.id].setCursor(p.lcd.x, p.lcd.y);
    lcds[p.lcd.id].print("        "); //8 spaces
    lcds[p.lcd.id].setCursor(p.lcd.x, p.lcd.y);
    lcds[p.lcd.id].print(p.lcd.name + "=" + p.value.toFixed(2));
  });
}

// INIT
setTimeout(function(){
  // LCD screens
  var LCD = [];
  LCD.push(setupHD44780lcdScreen(I2C1, SCL, SDA));
  LCD.push(setupHD44780lcdScreen(I2C3, P12, P11));
  refreshLCDs(LCD);

  // Read values
  getPhFromDataArray(pH, readMuxDataArray(MUX_PIN,MUX_INPUTS,S_PIN));

  // Setup server
  SPI2.setup({baud: 3200000, mosi: MOSI, miso: MISO, sck: SCK});
  var eth = require('WIZnet').connect(SPI2, ETH_CONNECT_PIN);
  // Получаем и выводим IP-адрес от DHCP-сервера
  eth.setIP({

      ip: "25.25.5.204",
      subnet: "255.255.255.0",
      gateway: "25.25.5.1",
      dns: "25.25.5.1",
      mac: "00:08:dc:01:02:04"

  });
  print(eth.getIP());

  // Answer http requests with string result
  // Format: parameter=value;
  require("http").createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('time='+getTime().toFixed(3)+';');
    pH.forEach(function(p){
      res.write(p.id+'='+p.value.toFixed(3)+';');
    });
    res.end();
  }).listen(PORT);

  // Run loop
  setInterval(function() {
    getPhFromDataArray(pH, readMuxDataArray(MUX_PIN,MUX_INPUTS,S_PIN));
    phToLCD(pH, LCD);
  }, READ_INTERVAL);
}, INIT_PAUSE);



setInterval(function(){
    require("http").get("http://25.25.5.205:8080", function(res) {
        res.on('data', function(data) {
            console.log(data);
        });
    });
},1000);





