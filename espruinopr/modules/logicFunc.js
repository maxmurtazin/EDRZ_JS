module.exports.GR = function (arr) {
  return (arr[0] > arr[1])
};
module.exports.LS = function (arr) {
  return (arr[0] < arr[1])
};
module.exports.GE = function (arr) {
  return (arr[0] >= arr[1])
};
module.exports.EQ = function (arr) {
  return (arr[0] === arr[1])
};
module.exports.LE = function (arr) {
  return (arr[0] <= arr[1])
};
module.exports.TR = function () {
  return true
};
module.exports.FL = function () {
  return false
};
