// Настраиваем соединение с Ethernet Shield по протоколу SPI.
SPI2.setup({baud: 3200000, mosi: B15, miso: B14, sck: B13});
var eth = require('WIZnet').connect(SPI2, P10);
// Получаем и выводим IP-адрес от DHCP-сервера
eth.setIP();
print(eth.getIP());
 
  require("http").createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World');
  res.end();
}).listen(8080);


/*function onPageRequest(req, res) {
  var a = url.parse(req.url, true);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<html><body>');
  res.write('<p>Pin is '+(BTN.read()?'on':'off')+'</p>');
  res.write('<a href="?led=1">on</a><br/><a href="?led=0">off</a>');
  res.end('</body></html>');
  if (a.query && "led" in a.query)
    digitalWrite(LED1, a.query["led"]);
}
require("http").createServer(onPageRequest).listen(8080);*/