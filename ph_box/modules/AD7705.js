// SPI
const CSpin = [P0, P1];
const SCKpin = A5;
const MOSIpin = P2;
const MISOpin = P3;

// Do nothing: write 1 to !DRDY

// setNextOperation:
// write 8 bit to communication reg, starting with 0
// !DRDY  RS2  RS1  RS0  R/!W  STBY  CH1  CH0
// 0      (register id)  1(R)  0     (ch sel)

// Channel selection (ch sel):
const CHN_AIN1 = 0x0; // AIN1(+) AIN1(−)
const CHN_AIN2 = 0x1; // AIN2(+) AIN2(−)
const CHN_M1M1 = 0x2; // AIN1(−) AIN1(−)
const CHN_M1M2 = 0x3; // AIN1(−) AIN2(−)

// Register selection (register id):
const REG_CMM    = 0x0; // Communication register (8 bits)
const REG_SETUP  = 0x1; // Setup register (8 bits)
const REG_CLOCK  = 0x2; // Clock register (8 bits)
const REG_DATA   = 0x3; // Data register (16 bits)
const REG_TEST   = 0x4; // Test register (8 bits)
const REG_NOP    = 0x5; // No operation
const REG_OFFSET = 0x6; // Offset (zero-scale calibration) register (24 bits)
const REG_GAIN   = 0x7; // Gain (full-scale calibration) register (24 bits)

// Setup Register Description:
// MD1  MD0  G2  G1  G0  !B/U  BUF  FSYNC
// (modesel) (gain sel)  (pol) 1    0

// Operating Mode Options (modesel):
const MODE_NORMAL         = 0x0; // normal mode
const MODE_SELF_CAL       = 0x1; // self-calibration
const MODE_ZERO_SCALE_CAL = 0x2; // zero-scale system calibration, POR 0x1F4000, set FSYNC high before calibration, FSYNC low after calibration
const MODE_FULL_SCALE_CAL = 0x3; // full-scale system calibration, POR 0x5761AB, set FSYNC high before calibration, FSYNC low after calibration

// Gain selection (gain sel):
const GAIN_1 = 0x0;
const GAIN_2 = 0x1;
const GAIN_4 = 0x2;
const GAIN_8 = 0x3;
const GAIN_16 = 0x4;
const GAIN_32 = 0x5;
const GAIN_64 = 0x6;
const GAIN_128 = 0x7;

// Bipolar/Unipolar Operation (pol):
const UNIPOLAR = 0x0;
const BIPOLAR = 0x1;

// Clock Register Description:
// ZERO  ZERO  ZERO  CLKDIS  CLKDIV  CLK  FS1  FS0
// 0     0     0     disable divider (clock+filter)

// Output Update Rates (clock+filter):
const UPDATE_RATE_20  = 0x0; // 20 Hz   Low-freq quartz
const UPDATE_RATE_25  = 0x1; // 25 Hz   Low-freq quartz
const UPDATE_RATE_100 = 0x2; // 100 Hz  Low-freq quartz
const UPDATE_RATE_200 = 0x3; // 200 Hz  Low-freq quartz
const UPDATE_RATE_50  = 0x4; // 50 Hz  High-freq quartz
const UPDATE_RATE_60  = 0x5; // 60 Hz  High-freq quartz
const UPDATE_RATE_250 = 0x6; // 250 Hz High-freq quartz
const UPDATE_RATE_500 = 0x7; // 500 Hz High-freq quartz

// Test register -- don't touch! Always 0x0
// Offset (zero-scale calibration) register...
// Gain (full-scale calibration) register...
// Calibration Sequences...

// main constructor
var AD7705 = function() {
  this.CSpin = CSpin;
  this.SCKpin = SCKpin;
  this.MOSIpin = MOSIpin;
  this.MISOpin = MISOpin;

  this.CHN_AIN1 = CHN_AIN1;
  this.CHN_AIN2 = CHN_AIN2;
  this.CHN_M1M1 = CHN_M1M1;
  this.CHN_M1M2 = CHN_M1M2;

  this.REG_CMM   = REG_CMM;
  this.REG_SETUP = REG_SETUP;
  this.REG_CLOCK = REG_CLOCK;
  this.REG_DATA  = REG_DATA;
  this.REG_TEST  = REG_TEST;
  this.REG_NOP   = REG_NOP;
  this.REG_OFFSET= REG_OFFSET;
  this.REG_GAIN  = REG_GAIN;

  this.MODE_NORMAL         = MODE_NORMAL;
  this.MODE_SELF_CAL       = MODE_SELF_CAL;
  this.MODE_ZERO_SCALE_CAL = MODE_ZERO_SCALE_CAL;
  this.MODE_FULL_SCALE_CAL = MODE_FULL_SCALE_CAL;

  this.GAIN_1 = GAIN_1;
  this.GAIN_2 = GAIN_2;
  this.GAIN_4 = GAIN_4;
  this.GAIN_8 = GAIN_8;
  this.GAIN_16 = GAIN_16;
  this.GAIN_32 = GAIN_32;
  this.GAIN_64 = GAIN_64;
  this.GAIN_128 = GAIN_128;

  this.UNIPOLAR = UNIPOLAR;
  this.BIPOLAR = BIPOLAR;

  this.UPDATE_RATE_20 = UPDATE_RATE_20;
  this.UPDATE_RATE_25 = UPDATE_RATE_25;
  this.UPDATE_RATE_100 = UPDATE_RATE_100;
  this.UPDATE_RATE_200 = UPDATE_RATE_200;
  this.UPDATE_RATE_50 = UPDATE_RATE_50;
  this.UPDATE_RATE_60 = UPDATE_RATE_60;
  this.UPDATE_RATE_250 = UPDATE_RATE_250;
  this.UPDATE_RATE_500 = UPDATE_RATE_500;
};

AD7705.prototype.setNextOperation = function(
  reg = 0,
  channel = 0,
  readWrite = 0) {
  var r = 0;
  r = reg << 4 | readWrite << 3 | channel;

  digitalWrite(CSpin, 0);
  SPI.write(r);
  digitalWrite(CSpin, 1);
};

AD7705.prototype.writeClockRegister = function(
  CLKDIS, 
  CLKDIV, 
  outputUpdateRate) {
  var r = CLKDIS << 4 | CLKDIV << 3 | outputUpdateRate;

  r &= ~(1 << 2); // clear CLK

  digitalWrite(CSpin, 0);
  SPI.write(r);
  digitalWrite(CSpin, 1);
};

AD7705.prototype.writeSetupRegister = function(
  operationMode,
  gain,
  unipolar,
  buffered,
  fsync) {
  var r = operationMode << 6 | gain << 3 | unipolar << 2 | buffered << 1 | fsync;

  digitalWrite(CSpin, 0);
  SPI.write(r);
  digitalWrite(CSpin, 1);
};

AD7705.prototype.readADResult = function() {
  digitalWrite(CSpin, 0);
  var b1 = SPI.send(0x0);
  var b2 = SPI.send(0x0);
  digitalWrite(CSpin, 1);

  var r = b1 << 8 | b2;

  return r;
};

AD7705.prototype.dataReady = function(
  channel) {
  AD7705.setNextOperation(REG_CMM, channel, 1);

  digitalWrite(CSpin, 0);
  var b1 = SPI.send(0x0);
  digitalWrite(CSpin, 1);

  return (b1 & 0x80) == 0x0;
};

AD7705.prototype.readADResultRaw = function(
  channel) {
  while (!AD7705.dataReady(channel));
  AD7705.setNextOperation(REG_DATA, channel, 1);

  return AD7705.readADResult();
};

AD7705.prototype.readADResult = function(
  channel,
  refOffset) {
  return AD7705.readADResultRaw(channel) * 1.0 / 65536.0 * VRef - refOffset;
};


AD7705.prototype.reset = function() {
  digitalWrite(CSpin, 0);
  for (int i = 0; i < 100; i++)
    SPI.write(0xff);
  digitalWrite(CSpin, 1);
};

AD7705.prototype.init = function(
  channel,
  clkDivider,
  polarity,
  gain,
  updRate) {
  AD7705.setNextOperation(REG_CLOCK, channel, 0);
  AD7705.writeClockRegister(0, clkDivider, updRate);

  AD7705.setNextOperation(REG_SETUP, channel, 0);
  AD7705.writeSetupRegister(MODE_SELF_CAL, gain, polarity, 0, 0);

  while (!AD7705.dataReady(channel));
}

AD7705.prototype.init = function(
  channel) {
  AD7705.init(channel, CLK_DIV_1, BIPOLAR, GAIN_1, UPDATE_RATE_25);
}

module.exports = AD7705;
//exports.AD7705 = AD7705;


/*
AD770X::AD770X(double vref) {
  VRef = vref;
  pinMode(pinMOSI, OUTPUT);
  pinMode(pinMISO, INPUT);
  pinMode(pinSPIClock, OUTPUT);
  pinMode(pinCS, OUTPUT);

  digitalWrite(pinCS, HIGH);
  SPCR = _BV(SPE) | _BV(MSTR) | _BV(CPOL) | _BV(CPHA) | _BV(SPI2X) | _BV(SPR1) | _BV(SPR0);
}
*/
