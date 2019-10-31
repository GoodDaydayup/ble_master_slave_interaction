const app = getApp()
const secret = require('../encrypt/secret.js')
var format = require("../common/interface.js")
//import page from '../pages/device/device.js'
function ab2ascii(buffer){
  var asc
  var str=''
  for(var i=0;i<buffer.length;i+=2){
    asc = buffer.substring(i,i+2)
    str = str + String.fromCharCode(parseInt(asc,16))
  }
  return str
}
function get_version_cb(cmd_data){
  let ack = cmd_data.substring(0, 8);//ack_result(cmd_data.substring(0,8))
  if (ack != "00000001")
    return 2
  let ver = cmd_data.substring(64,96)
//  console.log(ver.toSring)
  
}
function check_ctrol_cb(cmd_data){
  let ack = cmd_data.substring(0, 8);//ack_result(cmd_data.substring(0,8))
  if (ack != "00000001")
    return 2
}
function set_context(check_item,context){
  var that = this
//console.log("check_item:"+check_item)
  switch(check_item){
    case "01": {
      let temp = parseInt(context.substring(0, 4),16)
      let hum =  parseInt(context.substring(4, 8),16)

      app.globalData.context = "温度：" + temp+"℃ 湿度："+hum  
      console.log(parseInt(check_item) + "===" + app.globalData.context)
    } break;
    case "02":{
      // if (context=="0000")
      app.globalData.context = (context == "00000000")?"有告警":"无告警"
    }break;
    case "03":{
      app.globalData.context = "正常"
    }break;
    case "04":{
      let angle = parseInt(context.substring(0, 4),16)
      app.globalData.context = "当前角度:" + angle+"°"
    }break;
    case "05": {
      let status = context.substring(0, 8)
      app.globalData.context = "门锁状态:" + status 
    } break;
    case "06": {
      //let imei = String.fromCharCode(context)
     // debugger
      let imei = ab2ascii(context)
      app.globalData.context ="imei:"+imei
      //console.log(app.globalData.context)
    } break;
    case "07": {
      app.globalData.context = "ok"
    } break;
    case "08": {
      app.globalData.context = "正常" 
    } break;
    case "09": {
      app.globalData.context = "正常" 
    } break;
  }
}


function check_item_cb(cmd_data){
  //console.log("全数据:" + decrypted)
  let ack = cmd_data.substring(0, 8);//ack_result(cmd_data.substring(0,8))
  if (ack != "00000001"){
    app.globalData.context ='ERROR'
    return 
  }
  let dada = secret.aesDecrypt(cmd_data.substring(8))
  let decrypted= dada.toString()
  //console.log("解密后数据:"+decrypted)
  
 
  let check_item = decrypted.substring(8, 10)
  let door_no = decrypted.substring(10, 12)
//  console.log("door_no:" + door_no)
  let context_len = parseInt(decrypted.substring(12, 16),16)
  let context = decrypted.substring(16, 16+context_len*2)
  //console.log("context_len:" + context_len + " context:" + context)
  set_context(check_item,context)
  return
}
function match_func(cmd_id,cmd_data){
  switch(cmd_id){
    case "00001205":  get_version_cb(cmd_data);break;
    case "00001212":  check_ctrol_cb(cmd_data);break;
    case "00001213":  check_item_cb(cmd_data) ;break;
    default:console.log("no register cmd:"+cmd_id);//break;

  }
  return 0;
}
module.exports = {
  match_func: match_func,

}