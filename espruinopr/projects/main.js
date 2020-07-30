var readFunctions = require('readFunctions');
var readings = require('readings');
var controls = require('controls');
// var waterLevel = require ('water-level');
var func = require('instrFunc');
var instrFunc = require('instrFunc');
var logicFunc = require('logicFunc');
var instr = require('instr');
var arrayFunctions = require('arrayFunctions');

const PORT = 80;
const READ_LOOP = 233;
const INSTR_LOOP = 523;

// READ LOOP //

var pressReads = {};
var condReads = {};
var currentReads = {};
var diffVoltReads = {};
var reedArr = {};
var controlsArr = {};
var reads = {};
var readsStr = '';

setInterval(function() {
  // instrFunc.readMux();
  // pressReads = readFunctions.getPressValues(readings.pressArr);
  condReads = readFunctions.getCondValues(readings.condArr);
  currentReads = readFunctions.getCurrentValues(readings.currentArr);
  diffVoltReads = readFunctions.getVoltageMeasure(readings.diffVoltArr);
  reedArr = readFunctions.readReeds(readings.reedArr);
  controlsArr = readFunctions.checkControls(controls);
  // reads = readFunctions.merge(reads, pressReads);
  reads = readFunctions.merge(reads, condReads);
  reads = readFunctions.merge(reads, currentReads);
  reads = readFunctions.merge(reads, diffVoltReads);
  reads = readFunctions.merge(reads, reedArr);
  reads = readFunctions.merge(reads, controlsArr);
  readsStr = JSON.stringify(reads);
}, READ_LOOP);

// INSTRUCTIONS LOOP //

var instrArr = [];
var interval = setInterval(() => {
  instrArr = instr.instrArr;
  arrayFunctions.callArrayOfFunctions(instrArr, reads, controls);
}, INSTR_LOOP);

// HTTP SERVER //

// Настраиваем соединение с Ethernet Shield по протоколу SPI.
SPI2.setup({baud: 3200000, mosi: B15, miso: B14, sck: B13});
var eth = require('WIZnet').connect(SPI2, P10);
// Получаем и выводим IP-адрес от DHCP-сервера
eth.setIP({
  ip: "25.25.5.204",
  subnet: "255.255.255.0",
  gateway: "25.25.5.1",
  dns: "25.25.5.1",
  mac: "00:08:dc:01:02:05"
});
print(eth.getIP());

// GET, POST //

require("http").createServer(function (req, res) {
  if (req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(readsStr);
    res.end();
  }
  if (req.method === 'POST') {
    var changed = 'No change';
    req.on('data', (data) => {
      data = JSON.parse(data);
      if (data.command === 'writeGroup' &&
        data.key &&
        data.value &&
        controls[data.key] &&
        data.value.controls) {
        for (var ctrl in data.value.controls) {
          switch (ctrl) {
            case 'ev':
              if (data.value.controls[ctrl].val) {
                instrFunc.open_ev(controls[data.key][ctrl].addr);
                changed = 'Valve ' + data.key + ' is on';
              } else {
                instrFunc.close_ev(controls[data.key][ctrl].addr);
                changed = 'Valve ' + data.key + ' is off';
              }
              changed = 'Changed';
            break;
            case 'pm':
              if (data.value.controls[ctrl].val) {
                instrFunc.pump_on(controls[data.key][ctrl].addr);
                changed = 'Pump ' + data.key + ' is on';
              } else {
                instrFunc.pump_off(controls[data.key][ctrl].addr);
                changed = 'Pump ' + data.key + ' is off';
              }
            break;
            case 'reversal':
              if (data.value.controls[ctrl].val) {
                instrFunc.revCurrent(controls[data.key][ctrl].addr);
                changed = 'Reversal current ' + data.key;
              } else {
                instrFunc.dirCurrent(controls[data.key][ctrl].addr);
                changed = 'Direct current ' + data.key;
              }
            break;
          }
        }
      }
    });
    req.on('end', () => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(changed);
      res.end();
    });
  }
}).listen(PORT);
