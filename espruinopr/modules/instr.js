var instrArr = [];

// D2 conductivity
instrArr.push({
  condit: 'TR',
  conditArgs: [],
  // conditArgs: [
  //   { pointer: true, ref: { gr: 'D2', subgr: 'readings', value: 'cond' } },
  //   { pointer: false, value: 0.65 }
  // ],
  func: 'open_ev',
  funcArgs: { pointer: true, ref: { gr: 'D3', subgr: 'ev', value: 'addr' } }
  // funcElse: 'close_ev',
  // funcElseArgs: { pointer: true, ref: { gr: 'D3', subgr: 'ev', value: 'addr' } },
  // res: null
});

// C1 conductivity
instrArr.push({
  condit: 'GE',
  conditArgs: [
    { pointer: true, ref: { gr: 'C1', subgr: 'readings', value: 'cond' } },
    { pointer: false, value: 15 }
  ],
  func: 'open_ev',
  funcArgs: { pointer: true, ref: { gr: 'C0', subgr: 'ev', value: 'addr' } },
  funcElse: 'close_ev',
  funcElseArgs: { pointer: true, ref: { gr: 'C0', subgr: 'ev', value: 'addr' } },
  res: null
});

// D2 reed
instrArr.push({
  condit: 'EQ',
  conditArgs: [
    { pointer: true, ref: { gr: 'D2', subgr: 'controls', value: 'reed' } },
    { pointer: false, value: false }
  ],
  func: 'open_ev',
  funcArgs: { pointer: true, ref: { gr: 'D2', subgr: 'ev', value: 'addr' } },
  funcElse: 'close_ev',
  funcElseArgs: { pointer: true, ref: { gr: 'D2', subgr: 'ev', value: 'addr' } },
  res: null
});

// C1 reed
instrArr.push({
  condit: 'EQ',
  conditArgs: [
    { pointer: true, ref: { gr: 'C1', subgr: 'controls', value: 'reed' } },
    { pointer: false, value: false }
  ],
  func: 'open_ev',
  funcArgs: { pointer: true, ref: { gr: 'C1', subgr: 'ev', value: 'addr' } },
  funcElse: 'close_ev',
  funcElseArgs: { pointer: true, ref: { gr: 'C1', subgr: 'ev', value: 'addr' } },
  res: null
});

// D1 reed
instrArr.push({
  condit: 'EQ',
  conditArgs: [
    { pointer: true, ref: { gr: 'D1', subgr: 'controls', value: 'reed' } },
    { pointer: false, value: false }
  ],
  func: 'open_ev',
  funcArgs: { pointer: true, ref: { gr: 'D1', subgr: 'ev', value: 'addr' } },
  funcElse: 'close_ev',
  funcElseArgs: { pointer: true, ref: { gr: 'D1', subgr: 'ev', value: 'addr' } },
  res: null
});

// C2 reed
instrArr.push({
  condit: 'EQ',
  conditArgs: [
    { pointer: true, ref: { gr: 'C2', subgr: 'controls', value: 'reed' } },
    { pointer: false, value: false }
  ],
  func: 'open_ev',
  funcArgs: { pointer: true, ref: { gr: 'C2', subgr: 'ev', value: 'addr' } },
  funcElse: 'close_ev',
  funcElseArgs: { pointer: true, ref: { gr: 'C2', subgr: 'ev', value: 'addr' } },
  res: null
});

module.exports.instrArr = instrArr;
