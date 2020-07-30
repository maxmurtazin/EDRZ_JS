// const mux1 = A0;// analog pin cinnected to mux1
// const mux2 = A1; //analog pin connected to mux 2
// const S0_PIN = P13;// multyplex select digital pins
// const S1_PIN = P7;// multyplex select digital pins
// const S2_PIN = P9;// multyplex select digital pins

// instrFunc.muxDataArray = new Array(16);
// instrFunc.readMux = function () {
//   for (var i = 0; i < 8; i++) {
//     dw(S0_PIN, i & 0x01);
//     dw(S1_PIN, i >> 1 & 0x01);
//     dw(S2_PIN, i >> 2 & 0x01);
//     instrFunc.muxDataArray[i] = ar(mux1);
//     instrFunc.muxDataArray[i + 8] = ar(mux2);
//   }
//   return instrFunc.muxDataArray;
// };

//Pin connected to ST_CP of 74HC595
const latchPin = P1;
//Pin connected to SH_CP of 74HC595
const clockPin = P4;
//Pin connected to DS of 74HC595
const dataPin = P0;

const prnt=console.log;
const ar=analogRead;
const aw=analogWrite;
const dr=digitalRead;
const dw=digitalWrite;

var instrFunc = {};

const shOut = function (myDataPin, myClockPin, myDataOut) {
  var i=0;
  var pinState;
  dw(myDataPin, 0);
  dw(myClockPin, 0);
  for(i=7;i>=0;i--){
    dw(myClockPin, 0);
    pinState=(myDataOut&(1<<i)) ? 1 : 0;
    //dw([myDataPin,myClockPin,myDataPin],[pinState,1,0])
    //Sets the pin to HIGH or LOW depending on pinState
    dw(myDataPin, pinState);
    //register shifts bits on upstroke of clock pin
    dw(myClockPin, 1);
    //zero the data pin after shift to prevent bleed through
    dw(myDataPin, 0);
  }
  //stop shifting
  dw(myClockPin, 0);
};

instrFunc.r = {
  regs: 0,
  on:  function (addr) {
    this.regs = this.regs | addr;
    return this.regs;
  },
  off: function (addr) {
    this.regs = this.regs & ~ addr;
    return this.regs;
  },
  sw:  function (addr) {
    this.regs = this.regs ^ addr;
    return this.regs;
  }
};

const WrShReOn = function (addr) {
  dw(latchPin, 0);
  shOut(dataPin, clockPin, instrFunc.r.on(addr));
  dw(latchPin, 1);
};
const WrShReOff = function (addr) {
  dw(latchPin, 0);
  shOut(dataPin, clockPin, instrFunc.r.off(addr));
  dw(latchPin, 1);
};
const WrShReSw = function(addr) {
  dw(latchPin, 0);
  shOut(dataPin, clockPin, instrFunc.r.sw(addr));
  dw(latchPin, 1);
};
instrFunc.pump_on = function (addr) { //pump on
  WrShReOn(addr);
};
instrFunc.pump_off = function (addr) { // pump off
  WrShReOff(addr);
};
instrFunc.open_ev = function (addr) { //open electrovalve
  WrShReOn(addr);
};
instrFunc.close_ev = function (addr) { // close electrovalve
  WrShReOff(addr);
};
instrFunc.dirCurrent = function (addr) {
  WrShReOff(addr);
};
instrFunc.revCurrent = function (addr) {
  WrShReOn(addr);
};
instrFunc.aRead = function (x) {
  return ar(x)
};

module.exports = instrFunc;
