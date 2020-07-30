
/////////////////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////floats//////////////////////////////////////////////////

//rred
var levelSensorD1 = require('water-level').connect(P11, {mounted: 'onTop', debounce: 0.1}); //p11
var levelSensorC1 = require('water-level').connect(P8, {mounted: 'onTop', debounce: 0.1});//p 8
var levelSensorD2 = require('water-level').connect(P12, {mounted: 'onTop', debounce: 0.1});//p12
var levelSensorC2 = require('water-level').connect(P5, {mounted: 'onTop', debounce: 0.1});//p5


//читаем положение поплавка датчика
levelSensorD1.read();
levelSensorC1.read();
levelSensorD2.read();
levelSensorC2.read();

/////////////////////////////////////////////////
levelSensorD1.on('up', function () {

    console.log('high1');


});

levelSensorD1.on('down', function () {

    console.log('lowD1');

});
/////////////////////////////////////////////////////

levelSensorC1.on('up', function () {

    console.log('highD1');

});

levelSensorC1.on('down', function () {

    console.log('lowD1');
});
/////////////////////////////////////////////////////

levelSensorD2.on('up', function () {
    console.log('highD2');

});

levelSensorD2.on('down', function () {
    console.log('lowD2');
});
///////////////////////////////////////////////////////

levelSensorC2.on('up', function () {
    console.log('highC2');
});

levelSensorC2.on('down', function () {
    console.log('lowC2');
});









