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
        digitalWrite(P7, postData.pump1); // test ok // rewrite on shigt reg function
        digitalWrite(P6, postData.pump2);
        digitalWrite(P5, postData.EV1);
        digitalWrite(P4, postData.EV2);
        digitalWrite(P3, postData.EV3);
        digitalWrite(P2, postData.EV4);
        digitalWrite(P1, postData.EV5);
        digitalWrite(P0, postData.EV6);



        // call our callback (to send the HTML result)
        callback();
    });
}

require("http").createServer(onPageRequest).listen(80);