/////////////pins////////////////////////////////////////
var CSpin = [P0, P1];
var SCKpin = A5;
var MOSIpin = P2;
var MISOpin = P3;
/////////////////////func1////////////////////////////////
var readADC = function readADC(numb){
	var iCS = Math.floor(numb/8);

  ///alg
  digitalWrite(CSpin[iCS], 1);
  digitalWrite(SCKpin, 0);
  digitalWrite(CSpin[iCS], 0);

  var command = numb;
  command |= 0x18;
  command <<= 3;

  for (var i=0; i<5; i++) {
    digitalWrite(MOSIpin, command & 0x10);

    command <<= 1;
    digitalWrite(SCKpin, 1);
    digitalWrite(SCKpin, 0);
  }

  var adcout = 0;
  for (var k=0; k<12; k++) {
    digitalWrite(SCKpin, 1);
    digitalWrite(SCKpin, 0);
    adcout <<= 1;
    if (digitalRead(MISOpin))
      adcout |= 0x1;
  }
  digitalWrite(SCKpin, 1);

  adcout >>= 1;
  return adcout;

}

module.exports.readADC=readADC;
/////////////test/////////

// function  sayHi() {
//     console.log('D1______'+ readADC(0));// first ADC
//     console.log('D2______'+ readADC(1));// first ADC
//     console.log('D3______'+ readADC(2));// first ADC
//     console.log('D4______'+ readADC(3));// first ADC
//     console.log('D5______'+ readADC(4));// first ADC
//     console.log('D6______'+ readADC(5));// first ADC
//     console.log('D7______'+ readADC(6));// first ADC
//     console.log('D8______'+ readADC(7));// first ADC
// //////////////////////////////////////////////////////////
//     console.log('D9______'+ readADC(8)); //second ADC
//     console.log('D10______'+ readADC(9)); //second ADC
//     console.log('D11______'+ readADC(10)); //second ADC
//     console.log('D12______'+ readADC(11)); //second ADC
//     console.log('D13______'+ readADC(12)); //second ADC
//     console.log('D14______'+ readADC(13)); //second ADC
//     console.log('D15______'+ readADC(14)); //second ADC
//     console.log('D16______'+ readADC(15)); //second ADC
//
//     //console.log('D2______'+ E.getAnalogVRef(A0));
//
// }
// setInterval(sayHi, 2000);
