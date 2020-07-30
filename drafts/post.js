

//////////////////////////////////////////////////////////////////////////
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


let arrWrite = [0, 0, 0, 0, 0, 0, 0, 0];

function WriteShiftReg(addr, select) {
    {
        //let arrWrite = [0, 0, 0, 0, 0, 0, 0, 0];
        arrWrite.splice(addr, 1, select);//меняем адрес

        let arrWriteRev = arrWrite.reverse();
        let str = arrWriteRev.join();
        let dataStr = str.replace(/,/g, '');
        let decData = parseInt(dataStr, 2);
        //dw(latchPin, 0);
        shOut(dataPin, clockPin,decData);
        //dw(latchPin, 1);

    }
    return console.log(dataStr);

}

////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////работает все , но это нельзя использовать//////////////

// var arrWrite=[0,0,0,0,0,0,0,0];
// //arrWrite.splice(0, 1,1);
// //arrWrite.splice(0, 1,1);
// let arrWriteRev=arrWrite.reverse();
// let str=arrWriteRev.join();//
// let dataStr=(arrWriteRev.join()).replace(/,/g, '');//?
// let decData= parseInt(dataStr, 2);//
//
// dw(latchPin, 0);
// shOut(dataPin, clockPin,decData);
// dw(latchPin, 1);
//
// console.log(dataStr);

/////////////////////////////////////////////////////////////////////






//
// // Настраиваем соединение с Ethernet Shield по протоколу SPI.
// SPI2.setup({baud: 3200000, mosi: B15, miso: B14, sck: B13});
// var eth = require('WIZnet').connect(SPI2, P10);
// // Получаем и выводим IP-адрес от DHCP-сервера
// eth.setIP();
// print(eth.getIP());

// GET //

// require("http").createServer(function (req, res) {
//
//
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     // res.write(JSON.stringify(mergeReadings(pHreads, flowReads)));
//     res.end();
// }).listen(80);

// для установки (стат. адрес)
// {
//     ip: "25.25.5.204",
//         subnet: "255.255.255.0",
//     gateway: "25.25.5.1",
//     dns: "25.25.5.1",
//     mac: "00:08:dc:01:02:05"
// }

/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// Настраиваем соединение с Ethernet Shield по протоколу SPI.
SPI2.setup({baud: 3200000, mosi: B15, miso: B14, sck: B13});
var eth = require('WIZnet').connect(SPI2, P10);

eth.setIP();
print(eth.getIP());
//////////////////////////////////////////////////////////////////////////

var postData = {};

function sendPage(res) {

    var d = `
<html>
 <body>
  <form action="#" method="post">
   
    
    <label for="pump1">pump1:</label>
    <input type="checkbox" id="pump1" name="pump1" value="1" ${postData.pump1?"checked":""}><br/>
    
    <label for="pump2">pump2:</label>
    <input type="checkbox" id="pump2" name="pump2" value="1" ${postData.pump2?"checked":""}><br/>
    
    <label for="EV1">EV1:</label>
    <input type="checkbox" id="EV1" name="EV1" value="1" ${postData.EV1?"checked":""}><br/>
    
    <label for="EV2">EV2:</label>
    <input type="checkbox" id="EV2" name="EV2" value="1" ${postData.EV2?"checked":""}><br/>
    
    <label for="EV3">EV3:</label>
    <input type="checkbox" id="EV3" name="EV3" value="1" ${postData.EV3?"checked":""}><br/>
    
    <label for="EV4">EV4:</label>
    <input type="checkbox" id="EV4" name="EV4" value="1" ${postData.EV4?"checked":""}><br/>
    
    <label for="EV5">EV5:</label>
    <input type="checkbox" id="EV5" name="EV5" value="1" ${postData.EV5?"checked":""}><br/>
    
    <label for="EV6">EV6:</label>
    <input type="checkbox" id="EV6" name="EV6" value="1" ${postData.EV6?"checked":""}><br/>
    
    <button>Submit</button>
 
  </form>
 </body>
</html>`;
    res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length':d.length});
    res.end(d);
}

///////////////////////////////////////////////////////////////////////////////

function onPageRequest(req, res) {
    var a = url.parse(req.url, true);
    if (a.pathname=="/") {
        // handle the '/' (root) page...
        // If we had a POST, handle the data we're being given
        if (req.method=="POST" &&
            req.headers["Content-Type"]=="application/x-www-form-urlencoded")
            handlePOST(req, function() { sendPage(res); });
        else
            sendPage(res);
    } else {
        // Page not found - return 404
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("404: Page "+a.pathname+" not found");
    }
}


function handlePOST(req, callback) {
    var data = "";
    req.on('data', function(d) { data += d; });
    req.on('end', function() {

        postData = {};
        data.split("&").forEach(function(el) {
            var els = el.split("=");
            postData[els[0]] = decodeURIComponent(els[1]);
        });
        // finally our data is in postData
        console.log(postData);
        // do stuff with it!
        //console.log("We got sent the text ", postData.mytext);
        WriteShiftReg(0, postData.pump1); // test ok // rewrite on shigt reg function
        WriteShiftReg(1, postData.pump2);
        WriteShiftReg(2, postData.EV1);
        WriteShiftReg(3, postData.EV2);
        WriteShiftReg(4, postData.EV3);
        WriteShiftReg(5, postData.EV4);
        WriteShiftReg(6, postData.EV5);
        WriteShiftReg(7, postData.EV6);



        // call our callback (to send the HTML result)
        callback();
    });
}

require("http").createServer(onPageRequest).listen(80);
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

