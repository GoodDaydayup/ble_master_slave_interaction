var reg = require("./cmd_reg.js")
const secret = require('../encrypt/secret.js')

const REQUEST_FRAME_HEAD = "FF02" //请求报文帧头
const RESPONSE_FRAME_HEAD = "FF01" //响应报文帧头
const RESPONSE_SUCCESS = "00000001" //响应成功

// BGMP格式：PROTOCOL_FLAG + CMD_ID(4) + EQUIPMENT_ID + CMD_TYPE + SERIAL_NUM + RESERVE + LEN(2)
const PROTOCOL_FLAG = "42474D50"
const EQUIPMENT_ID = "00000000000000000000"
const CMD_REQUEST = "0001"
const CMD_RESPONSE = "0002"
const SERIAL_NUM = "0000"
const RESERVE = "000000000000000000000000"

const FOUR_BYTES_RESERVE = "00000000" //4字节保留
const EIGHT_BYTES_RESERVE = "0000000000000000"  //8字节保留
const APPENDER_BYTES = "0000000000000000000000000000" //14字节

/**
 * 将整形转为len长度的16进制串
 * data : 整数
 * len : 输出的16进制串长度
 */
function int2hexStr(data, len) {
  let hex = data.toString(16)
  let tmp = ""
  if (hex.length < len) {
    for (let i = 0; i < len - hex.length; i++) {
      tmp += "0"
    }
    return tmp + hex
  }
  return ""
}
function padRight(src) {
  let front_data = src.substring(0, parseInt(src.length / 32) * 32)
  let after_data

  if (src.length % 32 != 0) {
    after_data = src.substring(front_data.length)
  }
  let padding_data = (after_data + Array(32).join('0')).substring(0, 32)
  let aesdata = front_data + padding_data
  return aesdata
}

function getversion(cmd_id,para1,para2) {
  let src = FOUR_BYTES_RESERVE + "0000000100000000" + "FFFF" + APPENDER_BYTES
  // console.log('src:' + src)
 // let data = secret.aesEncrypt(src).toUpperCase()
  return package_data(cmd_id, src)
}
function check_ctrol(cmd_id, ctrol, para2) {
  let src = FOUR_BYTES_RESERVE + "0x".replace("x", ctrol) + EIGHT_BYTES_RESERVE
  // console.log('src:' + src)
//  let data = secret.aesEncrypt(src).toUpperCase()
  return package_data(cmd_id, src)
}
function check_item(cmd_id, item, door_no) {
  let src = FOUR_BYTES_RESERVE + "0x".replace("x", item) + "0x".replace("x", door_no)+ EIGHT_BYTES_RESERVE
  // console.log('src:' + src)
 // let data = secret.aesEncrypt(src).toUpperCase()
  return package_data(cmd_id, src)
}
function package_data(cmd_id, src) {
  let aesdata = padRight(src)
  let data = secret.aesEncrypt(aesdata).toUpperCase()
  let length =  data.length / 2
  let cmd_len = int2hexStr(length+18, 4)
  let data_len = int2hexStr(data.length / 2, 4)
   console.log('length : ' + length, ',cmd_len : ' + cmd_len,'data_len:'+data_len)

  let order = REQUEST_FRAME_HEAD + EQUIPMENT_ID + cmd_len + PROTOCOL_FLAG+
    SERIAL_NUM + "0000xxxx".replace("xxxx", cmd_id) + "0001" + FOUR_BYTES_RESERVE + data_len + data
//  console.log('cmd_len : ' + cmd_len)
 // console.log('命令：' + order)
  return order
}
function unpack(data){
  let _start = data.indexOf("ff")
  data = data.slice(_start)

  let frame_head = data.substr(_start,4).toUpperCase();
 
  if (frame_head == RESPONSE_FRAME_HEAD){
    let dev_id = data.substring(4,24)
    let data_len = data.substring(24, 28)
    //console.log(data)
    // console.log(data_len)
    data_len = (parseInt(data_len, 16) * 2 + 28)
    // console.log("data_len:" + data_len + " data.length:" + data.length)
    if (data_len>data.length)
      return 1
    //命令

//    console.log("dev_id:" + dev_id + " data_len:" + data_len + " length:" + data.length)
    let cmd_id = data.substring(40,48)
    // console.log(data)
    // console.log('cmd_id:'+cmd_id)
    let cmd_data = data.substring(64,data.length)
   
    reg.match_func(cmd_id,cmd_data)
    return 0
  }
  return 0
}

module.exports = {
    package_data: package_data,
    check_ctrol: check_ctrol,
    check_item: check_item,
    unpack:unpack
}