const app = getApp()
var msg = require("../../common/package.js")
var format = require("../../common/interface.js")
//const secret = require('../../encrypt/secret.js')
// const PASSIVE_SERVICE_UUID = "0000FF00-0000-1000-8000-00805F9B34FB"
const PASSIVE_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
const PASSIVE_WRITE_CHARACTERISTIC_UUID = "0000FF01-0000-1000-8000-00805F9B34FB"
// const PASSIVE_NOTIFY_CHARACTERISTIC_UUID = "0000FF02-0000-1000-8000-00805F9B34FB"
const PASSIVE_NOTIFY_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"


Page({
  data: {
    item_id:'0',
    receiveText: '',
    cmd_sem:true,
    timer:{},
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true,
    cmd_list:[],
    one_check_flag:false,
    button_item: 
    [
      {
        btnName: '温、湿度',
        labelVal: ""
      },
      {
        btnName: '水浸状态',
        labelVal: ""
      },
      {
        btnName: '震动检测',
        labelVal: ""
      },
      {
        btnName: '角度读取',
        labelVal: ""
      },
      {
        btnName: '门锁状态',
        labelVal: ""
      },
      {
        btnName: '无线模块',
        labelVal: ""
      },
      {
        btnName: 'flash检测',
        labelVal: ""
      },
      {
        btnName: '锁1检测',
        labelVal: ""
      },
      {
        btnName: '锁2检测',
        labelVal: ""
      },
      {
        btnName: '锁3检测',
        labelVal: ""
      },
      {
        btnName: '锁4检测',
        labelVal: ""
      },
      {
        btnName: '摄像头1测试',
        labelVal: ""
      },
      {
        btnName: '摄像头2测试',
        labelVal: ""
      },
      {
        btnName: '摄像头3测试',
        labelVal: ""
      },
      {
        btnName: '摄像头4测试',
        labelVal: ""
      },
    ],
  },
  Cmd_send: function (id) {
    var that = this
    var buffer;
    switch (id) {
      case 0:
        buffer=that.public_func(1213, 1, 0, msg.check_item);
        break
      case 1:
        buffer= that.public_func(1213, 2, 0, msg.check_item);
        break
      case 2:
        buffer=that.public_func(1213, 3, 0, msg.check_item);
        break
      case 3:
        buffer=that.public_func(1213, 4, 0, msg.check_item);
        break
      case 4:
        buffer=that.public_func(1213, 5, 0, msg.check_item);
        break
      case 5:
        buffer=that.public_func(1213, 6, 0, msg.check_item);
        break
      case 6:
        buffer=that.public_func(1213, 7, 0, msg.check_item);
        break
      case 7:
        buffer=that.public_func(1213, 8, 1, msg.check_item);
        break
      case 8:
        buffer=that.public_func(1213, 8, 2, msg.check_item);
        break
      case 9:
        buffer=that.public_func(1213, 8, 3, msg.check_item);
        break
      case 10:
        buffer=that.public_func(1213, 8, 4, msg.check_item);
        break
      case 11:
        buffer=that.public_func(1213, 9, 1, msg.check_item);
        break
      case 12:
        buffer=that.public_func(1213, 9, 2, msg.check_item);
        break
      case 13:
        buffer=that.public_func(1213, 9, 3, msg.check_item);
        break
      case 14:
        buffer=that.public_func(1213, 9, 4, msg.check_item);
        break

      default:
        break
    }
    return buffer
  },

  cmd_send_OneByOne: function(){
    var that =this
    console.log("one msg:" + this.data.item_id)
    if (that.data.item_id >= that.data.button_item.length) {
      that.data.one_check_flag = false
      return
    }
    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.services[0].uuid,
      //serviceId: PASSIVE_SERVICE_UUID,
      characteristicId: that.data.characteristics[0].uuid,
      value: that.data.cmd_list[that.data.item_id],
      success: function (res) {
        console.log('发送成功')
      }
    })
    //设置定时
    that.data.timer = setTimeout(function () {
      console.log("timeout")
     // that.data.cmd_list[that.data.item_id]='0'
      let btn_val = that.data.button_item
      btn_val[that.data.item_id-1].labelVal = "TimeOut"
        that.setData({
          button_item: btn_val
        })
      that.cmd_send_OneByOne()
    }, 8000)
  
    console.log("set timeout id" + that.data.item_id)
    that.data.item_id++
  },
  Send:function(){
    var that = this
    that.data.one_check_flag = true
    that.data.item_id=0;
    for(var i =0;i<that.data.button_item.length;i++){
      that.data.cmd_list[i] = that.Cmd_send(i)
    }
    that.cmd_send_OneByOne()
  },

  dispatch: function (event) {
    let that = this
    app.globalData.receivedata = ''
    app.globalData.context = ''
    console.log(event)
    that.data.item_id = parseInt(event.target.id)
    console.log('dispatch!' + 'that.data.item_id:' + that.data.item_id)
    that.Cmd_send(that.data.item_id)
    //超时处理
    that.data.timer = setTimeout(function () {
      console.log("timeout")
      // that.data.cmd_list[that.data.item_id]='0'
      let btn_val = that.data.button_item
      btn_val[that.data.item_id].labelVal = "TimeOut"
      that.setData({
        button_item: btn_val
      })
    }, 8000)
  },
 
  public_func: function (cmd_id,para1,para2,func) {
    var that = this
    if (that.data.connected) {
      var buffer = format.hex2ab(func(cmd_id, para1, para2))
      if (that.data.one_check_flag==true){
        console.log("buffer:")
        console.log()
        return buffer;
       }
     //if(0){
      console.log(buffer)
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[0].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功')  
        }
      })
    }
    else {
      that.data.timer && clearTimeout(that.data.timer)
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },

  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res.services)
        that.setData({
          services: res.services
        })
       // for(let i = 0;i<3;i++){
        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: res.services[0].uuid,
          success: function (resp) {
            console.log('service uuid:' + res.services[0].uuid)
            console.log(resp.characteristics)
            that.setData({
              characteristics: resp.characteristics
            })
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: options.connectedDeviceId,
              serviceId: PASSIVE_SERVICE_UUID,
              characteristicId: PASSIVE_NOTIFY_CHARACTERISTIC_UUID,
              // serviceId: that.data.services[i].uuid,
              // characteristicId: that.data.characteristics[i].uuid,
              success: function (res) {
                console.log('启用notify成功')
                that.public_func(1212, 1, 0, msg.check_ctrol);//自检开始
                // wx.onBLECharacteristicValueChange(function (res) {
                //   var response = format.ab2hex(res.value)
                //   console.log('接收到数据：' + response)
                //  // app.globalData.response = app.globalData.response.concat(response)
                // })
              },
              fail: function (res) {
                console.log('开启notify失败...')
                console.log(res)
                // onUnlockFail('开锁失败')
              }
            })
          }
        })
       // }
      }
    })
    
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {

      var receivedata = format.ab2hex(res.value)
      app.globalData.receivedata = app.globalData.receivedata.concat(receivedata)
      let result =  msg.unpack(app.globalData.receivedata)
      if(result==0){//接收结束
      //关定时
        that.data.timer && clearTimeout(that.data.timer)
        console.log("clear timer " + that.data.item_id)

        let index = parseInt(that.data.item_id)// + 1
        if (that.data.one_check_flag == true) {
          index--
          that.cmd_send_OneByOne()
        }
        console.log("get.data.item_id:" + that.data.item_id+" index:"+index)
        console.log('context:' + app.globalData.context)
        let btn_val = that.data.button_item
        btn_val[index].labelVal = app.globalData.context
        that.setData({
          button_item: btn_val
        })
        app.globalData.receivedata=''
        app.globalData.context=''
        //that.cmd_sem=true
        // if(that.data.one_check_flag==true){
          
        //   //that.data.item_id++
        //   that.cmd_send_OneByOne()
          
        // }
      }
    })

  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    console.log("Hide?")
    this.public_func(1212, 0, 0, msg.check_ctrol);//自检开始
  }
})