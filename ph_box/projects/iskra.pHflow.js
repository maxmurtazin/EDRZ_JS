const PORT = 80;
const READ_LOOP = 541; //ms (prime)
const LED_LOOP = 2003; //ms (prime)
const LED_RESPONSE_MS = 227; //ms (prime)

// LED //

var on = false;
setInterval(function() {
  on = !on;
  LED1.write(on);
  P0.write(on);
}, LED_LOOP);

// Flow Sensors //

const PULSE_PER_LITRE = 5880;

var flowReads = {};

var flowArr = {
  D0: {
    addr: P2,
    val: 0,
    digits: 2,
    ppl: PULSE_PER_LITRE,
    units: 'l/h',
    connect: null
  },
  C3: {
    addr: P3,
    val: 0,
    digits: 2,
    ppl: PULSE_PER_LITRE,
    units: 'l/h',
    connect: null
  }
};

const connectFlowMeters = function (flowArr) {
  for (var fl in flowArr) {
    flowArr[fl].connect =
      require('@amperka/water-flow')
        .connect(
          flowArr[fl].addr,
          {pulsesPerLitre: flowArr[fl].ppl});
  }
};

const getFlowValues = function (flowArr) {
  var res = {};
  for (var fl in flowArr) {
    flowArr[fl].val =
      flowArr[fl].connect.speed(flowArr[fl].units);
    res[fl] = { readings: {} };
    res[fl].readings.flow =
      flowArr[fl].val.toFixed(flowArr[fl].digits);
  }
  return res;
};

// pH-meters //

var pHreads = {};

var phArr = {
  D0: {
    addr: 'A5',
    val: 0,
    digits: 2,
    slope: 23.05,
    intercept: -6.148,
  },
  D2: {
    addr: 'A4',
    val: 0,
    digits: 2,
    slope: 19.09,
    intercept: -2.89,
  },
  C1: {
    addr: 'A0',
    val: 0,
    digits: 2,
    slope: 33.31,
    intercept: -6.312,
  },
  D1: {
    addr: 'A1',
    val: 0,
    digits: 2,
    slope: 44.4,
    intercept: -11.12,
  },
  C2: {
    addr: 'A2',
    val: 0,
    digits: 2,
    slope: 19.1,
    intercept: -0.419,
  },
  C3: {
    addr: 'A3',
    val: 0,
    digits: 2,
    slope: 9.143,
    intercept: 0.573,
  }
};

const getPhValues = function (phArr) {
  var res = {};
  var buf = 0;
  for (var ph in phArr) {
    buf = phArr[ph].slope * analogRead(phArr[ph].addr)
      + phArr[ph].intercept;
    // Усреднение по 3 точкам
    phArr[ph].val = (2 * phArr[ph].val + buf) / 3;
    res[ph] = { readings: {} };
    res[ph].readings.pH =
      phArr[ph].val.toFixed(phArr[ph].digits);
  }
  return res;
};

// Objects manipulation //

const mergeReadings = function (target, source) {
  for (var g in source) {
    if (target[g]) {
      for (var r in source[g].readings) {
        if (target[g].readings[r]) {
          Object.assign(
            target[g].readings[r],
            source[g].readings[r]);
        } else {
          target[g].readings[r] =
            source[g].readings[r];
        }
      }
    } else {
      target[g] =
        source[g];
    }
  }
  return target;
};

// READ LOOP //

var reads = {};

connectFlowMeters(flowArr);
setInterval(function() {
  flowReads = getFlowValues(flowArr);
  pHreads = getPhValues(phArr);
  reads = JSON.stringify(mergeReadings(pHreads, flowReads));
}, READ_LOOP);

// HTTP SERVER //

// Настраиваем соединение с Ethernet Shield по протоколу SPI.
SPI2.setup({baud: 3200000, mosi: B15, miso: B14, sck: B13});
var eth = require('WIZnet').connect(SPI2, P10);
// Получаем и выводим IP-адрес от DHCP-сервера
eth.setIP({
  ip: "25.25.5.205",
  subnet: "255.255.255.0",
  gateway: "25.25.5.1",
  dns: "25.25.5.1",
  mac: "00:08:dc:01:02:03"
});
print(eth.getIP());

// GET //

require("http").createServer(function (req, res) {
  setTimeout(function() {
    on = !on;
    LED1.write(on);
    P0.write(on);
  }, LED_RESPONSE_MS);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(reads);
  res.end();
}).listen(PORT);

