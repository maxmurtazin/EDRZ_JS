arrayFunctions = {};

arrayFunctions.checkPointers = function (elArray, groups) {
  var ret = [];
  if (Array.isArray(elArray)) {
    elArray.forEach(x => {
      var res = null
      if (x.pointer) {
        if (groups[x.ref.gr] && groups[x.ref.gr][x.ref.subgr]) {
            res = groups[x.ref.gr][x.ref.subgr][x.ref.value];
        }
      } else {
        res = x.value;
      }
      ret.push(res);
    })
  } else {
    if (elArray.pointer) {
      if (groups[elArray.ref.gr] &&
        groups[elArray.ref.gr][elArray.ref.subgr]) {
        ret = groups[elArray.ref.gr][elArray.ref.subgr][elArray.ref.value];
      }
    } else {
      ret = elArray.value;
    }
  }
  return ret;
};

arrayFunctions.callArrayOfFunctions = function (arrIns, reads, controls) {
  // calling function from array of functions
  function call (f) {
    if (typeof f === 'function') {
      f();
    } else {
      // f -- { condit, conditArgs,
      // func: ..., funcArgs: ...,
      // funcElse: ..., funcElseArgs: ...,
      // res: ... }
      var conditArgs = f.conditArgs
        ? arrayFunctions.checkPointers(f.conditArgs, reads)
        : [];
      var funcArgs = f.funcArgs
        ? arrayFunctions.checkPointers(f.funcArgs, controls)
        : [];
      var funcElseArgs = f.funcElseArgs
        ? arrayFunctions.checkPointers(f.funcElseArgs, controls)
        : [];
      if (logicFunc[f.condit](conditArgs)) {
        try {
          if (f.res) {
            f.res = instrFunc[f.func](funcArgs);
          } else {
            instrFunc[f.func](funcArgs);
          }
        } catch (e) {
          f.error = e.message;
          console.log(e);
          return e.message;
        }
      } else {
        if (f.funcElse) {
          try {
            if (f.res) {
              f.res = instrFunc[f.funcElse](funcElseArgs);
            } else {
              instrFunc[f.funcElse](funcElseArgs);
            }
          } catch (e) {
            f.error = e.message;
            console.log(e);
            return e.message;
          }
        }
      }
    }
  }
  var errors = [];
  arrIns.forEach(ins => {
    errors.push(call(ins));
  });
  errors.join('; ');
  return errors;
};

module.exports = arrayFunctions;
