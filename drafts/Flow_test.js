

var flowSensor1 = require('@amperka/water-flow').connect(P2, {pulsesPerLitre: 5880} );
var flowSensor2 = require('@amperka/water-flow').connect(P3,  {pulsesPerLitre: 5880});




var speed1 = flowSensor1.speed('l/min');
var speed2= flowSensor2.speed('l/min');


setInterval(function() {console.log(speed1);},1000);

setInterval(function() {console.log(speed2);},1000);


/*

 connect(pin [, opts])
Создаёт новый объект WaterFlow для датчика на пине pin. Принимает необязательный объект opts с настройками поведения:

averageLength — длина массива скользящего среднего. Значение по умолчанию — 10.
pulsesPerLitre — количество пульсов приходящихся на 1 литр прошедшей жидкости. Этот параметр зависти от типа датчика и по умолчанию принимает значение 450.
minimumSpeed — минимальная скорость потока жидкости для данного типа датчика. Значение по умолчанию — 1.
 WaterFlow
Функции и объекты модуля
 volume([units])
Возвращает объем жидкости, прошедшее через датчик. Единицы измерения units могут принимать следующие значения:

'l' — литры
'cm^3' — кубические сантиметры
'm^3' — кубические метры
Значение по умолчанию — 'l'

var litres = flowSensor.volume('l');
 reset();
Сбрасывает в 0 значение, получаемое в функции volume(units).

 speed([units])
Возвращает скорость потока жидкости, проходящее через датчик. Параметр units может принимать следующие значения:

'l/min' — литры в минуту
'cm^3/min' — кубические сантиметры в минуту
'm^3/min' — кубические метры в минуту
Значение по умолчанию — 'l/min'.

var litresPerMinute = flowSensor.speed('l/min');
События, генерируемые модулем
 on('pulse', function () {...})
функция во втором аргументе будет вызвана каждый раз при обновлении объема жидкости, прошедшей через датчик. Чувствительность датчика позволяет обновить значение на 1/pulsesPerLitre литра.

flowSensor.on('pulse', function () {
  var litres = flowSensor.volume('l');
 */