var H = analogRead(A0);
I2C1.setup({scl:SCL, sda:SDA}); // connect display(pins)
var lcd1 = require("HD44780").connectI2C(I2C1);
lcd1.setCursor(0,0);// FIRST LINE,FIRST SIMB
lcd1.print("P1="+H);//test read from A0
lcd1.setCursor(0,1); // SECOND LINE, FIRST SIMB
lcd1.print("P2=");

lcd1.setCursor(8,0); // FIRST LINE, 9-SIMB
lcd1.print("FL1=");
lcd1.setCursor(8,1);// SECOND LINE,9-SIMB
lcd1.print("PH1=");




I2C3.setup({scl:P12, sda:P11});
var lcd2 = require("HD44780").connectI2C(I2C3);

lcd2.setCursor(0,0); 
lcd2.print("P3=");
lcd2.setCursor(0,1); 
lcd2.print("P4=");

lcd2.setCursor(8,0); 
lcd2.print("PH2=");
lcd2.setCursor(8,1); 
lcd2.print("FL2=");


