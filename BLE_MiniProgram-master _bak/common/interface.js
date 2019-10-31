//const app = getApp()

function hex2ab(hexStr) {
  var typedArray = new Uint8Array(hexStr.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }));
  return typedArray.buffer;
}
function ab2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

module.exports = {
//  package_data: package_data,
  hex2ab: hex2ab,
  ab2hex: ab2hex,
//  getUnlockOrder: getUnlockOrder,
}