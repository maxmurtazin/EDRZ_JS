  module.exports.pressArr = {
  D1: {
    addr: 7, //read by mux 1
    val: 0,
    digits: 2,
    slope: 1.0,
    intercept: 0
  },
  C1: {
    addr: 5, //read by mux 1
    val: 0,
    digits: 2,
    slope: 1.0,
    intercept: 0
  },
  D2: {
    addr: 2,//read by mux 1
    val: 0,
    digits: 2,
    slope: 1.0,//add real calibratioc
    intercept: 0
  },
  C2: {
    addr: 1,//read by mux 1
    val: 0,
    digits: 2,
    slope: 1.0,//add real calibration data
    intercept: 0
  }
};
module.exports.condArr = {
  D2:{
    addr: A1,
    val: 0,
    digits: 4,
    slope: 8.1903,
    intercept: -2.4272
  },
  C1: {
    addr: A0,
    val: 0,
    digits: 4,
    slope: 37.093,
    intercept: -11.088
  }
  };
module.exports.currentArr = {
  ED1: {
    addr: A5,
    val: 0,
    digits: 4,
    slope: -26.13,
    intercept: 19.17
  }
};
module.exports.diffVoltArr = {
  ED1: [
    {
      addr: A2,
      val: 0,
      digits: 4,
      slope: 3.2543,
      intercept: -0.0533
    },
    {
      addr: A4, // analog read function
      val: 0,
      digits: 4,
      slope: 30.886,
      intercept: -0.0328
    }
  ]
};
module.exports.reedArr = {
  // float-reeds
  D1: { 
    addr: P11,
    val: false
  },
  D2: { 
    addr: P7,
    val: false
  },
  C1: { 
    addr: P8,
    val: false
  },
  C2: { 
    addr: P12,
    val: false
  }
};
