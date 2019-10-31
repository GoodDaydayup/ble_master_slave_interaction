//app.js
App({
  buf2hex: function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
  },
  // buf2string: function (buffer) {
  //   console.log("buffer:" + buffer)
  //   var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
  //   console.log("arr:"+arr)
  //   var str = ''
  //   for (var i = 0; i < arr.length; i++) {
  //     str += String.fromCharCode(arr[i])
  //   }
  //   return str
  // },
  onLaunch: function () {
    this.globalData.SystemInfo = wx.getSystemInfoSync()
    //console.log(this.globalData.SystemInfo)
  },
  globalData: {
    SystemInfo: {},
    receivedata: '', //回包
    context:''
  }
})