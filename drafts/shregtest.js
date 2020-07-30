prnt=console.log;
ar=analogRead;
aw=analogWrite;
dr=digitalRead;
dw=digitalWrite;

//Pin connected to ST_CP of 74HC595
var latchPin = P1;
//Pin connected to SH_CP of 74HC595
var clockPin = P4;
////Pin connected to DS of 74HC595
var dataPin = P0;



/////////////////////////////////////////////////////////////////
function shOut(myDataPin, myClockPin, myDataOut) {

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
}

////////////////////////////////////////////////////////////////////
var Ar1 = 0x00; //0b00000000
var Ar2 = 0x01; //0b00000001
var Ar3 = 0x02; //0b00000010
var Ar4 = 0x04; //0b00000100
var Ar5 = 0x08; //0b00001000
var Ar6 = 0x10; //0b00010000
var Ar7 = 0x20; //0b00100000
var Ar8 = 0x100; //0b01000000
var Ar9 = 0x200; //0b10000000 //0000000010000000

const r = {
    regs: 0,
    on: function (addr) { return this.regs = this.regs | addr; }, //work
    off: function (addr) {return this.regs = this.regs |! addr; },
    sw: function  (addr) {return this.regs = this.regs ^ addr; }

}


function WriteShiftRegOn(addr) {
    dw(latchPin, 0);
    shOut(dataPin, clockPin,r.on(addr));
    dw(latchPin, 1);
}


function WriteShiftRegOff(addr) {
    dw(latchPin, 0);
    shOut(dataPin, clockPin,r.off(addr));
    dw(latchPin, 1);
}

function WriteShiftRegSw(addr) {
    dw(latchPin, 0);
    shOut(dataPin, clockPin,r.sw(addr));
    dw(latchPin, 1);
}





var levelSensorD1 = require('@amperka/water-level').connect(P5, {mounted: 'onTop', debounce: 0.1}); //p11

var levelSensorC1 = require('@amperka/water-level').connect(P8, {mounted: 'onTop', debounce: 0.1});//p 8

var levelSensorD2 = require('@amperka/water-level').connect(P11, {mounted: 'onTop', debounce: 0.1});//p12

var levelSensorC2 = require('@amperka/water-level').connect(P12, {mounted: 'onTop', debounce: 0.1});//p5


//читаем положение поплавка датчика на крышке бочки
levelSensorD1.read();
levelSensorC1.read();
levelSensorD2.read();
levelSensorC2.read();

 /////////////////////////////////////////////////
levelSensorD1.on('up', function () {
  WriteShiftRegOn(Ar2);
  console.log('high1');
  
    
});

levelSensorD1.on('down', function () {
   WriteShiftRegOff(Ar2);
  console.log('low1');
 
});
/////////////////////////////////////////////////////

levelSensorC1.on('up', function () {
  WriteShiftRegOn(Ar3);
  console.log('high2');
  
});

levelSensorC1.on('down', function () {
    WriteShiftRegSw(Ar3);
    console.log('low2');
});
/////////////////////////////////////////////////////

levelSensorD2.on('up', function () {
  console.log('high3');
 
});

levelSensorD2.on('down', function () {
    console.log('low3');
});
///////////////////////////////////////////////////////

levelSensorC2.on('up', function () {
    console.log('high4');
});

levelSensorC2.on('down', function () {
    console.log('low4');
});


