/*
  Shift Register Example
  Turning on the outputs of a 74HC595 using an array
 Hardware:
 * 74HC595 shift register 
 * LEDs attached to each of the outputs of the shift register
 */

// Сокращения:
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

//holders for infromation you're going to pass to shifting function
var dataArray = new Uint8Array(9);

//Binary notation as comment
dataArray[0] = 0x00; //0b00000000
dataArray[1] = 0x01; //0b00000001
dataArray[2] = 0x02; //0b00000010
dataArray[3] = 0x04; //0b00000100
dataArray[4] = 0x08; //0b00001000
dataArray[5] = 0x10; //0b00010000
dataArray[6] = 0x20; //0b00100000
dataArray[7] = 0x40; //0b01000000
dataArray[8] = 0x80; //0b10000000
l=dataArray.length;

// the heart of the program
function shOut(myDataPin, myClockPin, myDataOut) {
  // This shifts 8 bits out MSB first, 
  //on the rising edge of the clock,
  //clock idles low

  //internal function setup
  var i=0;
  var pinState;

  //clear everything out just in case to
  //prepare shift register for bit shifting
  dw(myDataPin, 0);
  dw(myClockPin, 0);

  //for each bit in the byte myDataOut
  //NOTICE THAT WE ARE COUNTING DOWN in our for loop
  //This means that %00000001 or "1" will go through such
  //that it will be pin Q0 that lights. 
    //if the value passed to myDataOut and a bitmask result 
    // true then... so if we are at i=6 and our value is
    // %11010100 it would the code compares it to %01000000 
    // and proceeds to set pinState to 1.
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

var LEDon=false;
j=0;

setInterval(function() {
  j=j%l;
  //load the light sequence you want from array
  prnt((dataArray[j]).toString(2));
  //ground latchPin and hold low for as long as you are transmitting
  dw(latchPin, 0);
  //move 'em out
  shOut(dataPin, clockPin, dataArray[j]);
  //return the latch pin high to signal chip that it 
  //no longer needs to listen for information
  dw(latchPin, 1);

  LEDon = !LEDon;
  LED1.write(LEDon);
  j++;
}, 2000);
