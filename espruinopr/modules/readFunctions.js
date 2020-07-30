const MEAN = 20;

var readFunctions = {};

readFunctions.getCondValues = function (condArr) {
  var res = {};
  var buf = 0;
  for (var cd in condArr) {
    buf = condArr[cd].slope * Number(analogRead(condArr[cd].addr))
      + condArr[cd].intercept;
    // Усреднение по MEAN точкам
    condArr[cd].val = ((MEAN-1) * condArr[cd].val + buf) / MEAN;
    res[cd] = { readings: {} };
    res[cd].readings.cond =
      condArr[cd].val.toFixed(condArr[cd].digits);
  }
  return res;
};

readFunctions.getPressValues = function (pressArr) {
  var res = {};
  var buf = 0;
  for (var pr in pressArr) {
    buf = pressArr[pr].slope * Number(instrFunc.muxDataArray[pressArr[pr].addr])
      + pressArr[pr].intercept;
    // Усреднение по MEAN точкам
    pressArr[pr].val = ((MEAN-1) * pressArr[pr].val + buf) / MEAN;
    res[pr] = { readings: {} };
    res[pr].readings.press =
      pressArr[pr].val.toFixed(pressArr[pr].digits);
  }
  return res;
};

readFunctions.getCurrentValues = function (currentArr) {
  var res = {};
  var buf = 0;
  for (var pr in currentArr) {
    buf = currentArr[pr].slope * Number(analogRead(currentArr[pr].addr))
      + currentArr[pr].intercept;
    // Усреднение по MEAN точкам
    currentArr[pr].val = ((MEAN-1) * currentArr[pr].val + buf) / MEAN;
    res[pr] = { readings: {} };
    res[pr].readings.current =
      currentArr[pr].val.toFixed(currentArr[pr].digits);
  }
  return res;
};

readFunctions.getVoltageMeasure = function (diffVoltArr) {
  var res = {};
  var buf0 = 0;
  var buf1 = 0;
  for (var en in diffVoltArr) {
    buf1 = (diffVoltArr[en][1].slope *
      Number(analogRead(diffVoltArr[en][1].addr))
      + diffVoltArr[en][1].intercept);
    buf0 = (diffVoltArr[en][0].slope *
      Number(analogRead(diffVoltArr[en][0].addr))
      + diffVoltArr[en][0].intercept);
    // Усреднение по MEAN точкам
    diffVoltArr[en][0].val =
      (((MEAN-1) * diffVoltArr[en][0].val + buf0) / MEAN)
      .toFixed(diffVoltArr[en][0].digits);
    diffVoltArr[en][1].val =
      (((MEAN-1) * diffVoltArr[en][1].val + buf1) / MEAN)
      .toFixed(diffVoltArr[en][1].digits);
    res[en] = { readings: {} };
    res[en].readings.voltageMeasure =
      diffVoltArr[en][1].val - diffVoltArr[en][0].val;
  }
  return res;
};

readFunctions.readReeds = function (reedArr) {
  var res = {};
  for (var rd in reedArr) {
    res[rd] = { controls: {} };
    reedArr[rd].val = !digitalRead(reedArr[rd].addr);
    res[rd].controls.reed = reedArr[rd].val;
  }
  return res;
};

readFunctions.checkControls = function (contrArr) {
  var res = {};
  for (var c in contrArr) {
    res[c] = { controls: {} };
    for (var r in contrArr[c]) {
      res[c].controls[r] = contrArr[c][r].val;
    }
  }
  return res;
};

readFunctions.merge = function (target, source) {
  // var res = JSON.parse(JSON.stringify(target));
  for (var g in source) {
    if (target[g]) {
      if (source[g].readings) {
        if (!target[g].readings) { target[g].readings = {} };
        for (var r in source[g].readings) {
          target[g].readings[r] = source[g].readings[r];
        }
      }
      if (source[g].controls) {
        if (!target[g].controls) { target[g].controls = {} };
        for (var c in source[g].controls) {
          target[g].controls[c] = source[g].controls[c];
        }
      }
    } else {
      target[g] =
        source[g];
    }
  }
  return target;
};

module.exports = readFunctions;