const CryptoJS = require("crypt.js")

/**
 * 加解密工具，采用AES128-ECB加密方式，加密key16字节，iv为空
 */

const AES_KEY = string2hex("fiberhomesodngrp")  //AES密钥，16字节
const b = CryptoJS.enc.Base64

var options = {
  // iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
  mode: CryptoJS.mode.ECB,  //ECB模式
  padding: CryptoJS.pad.Pkcs7 //填充方式
}

var options_no = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.NoPadding
}
/**
 * aes加密消息，返回加密后的16进制串
 * msg : 16进制串
 */
function aesEncrypt(msg) {
  let key = CryptoJS.enc.Hex.parse(AES_KEY)
  msg = CryptoJS.enc.Hex.parse(msg)
  let encoded = CryptoJS.AES.encrypt(msg, key, options_no)
  let result = encoded.ciphertext.toString()
  return result
}

/**
 * aes解密消息，返回原始16进制串
 * encoded : 加密16进制串
 */
function aesDecrypt(encoded) {
  let key = CryptoJS.enc.Hex.parse(AES_KEY)
  let decoded = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(encoded) }, key, options_no)
  return decoded//.toString(CryptoJS.enc.Utf8)
}

/**
 * des加密，返回16进制加密字符串
 * src : 16进制原始字符串
 * key : 加密key，8字节16进制串
 */
function desEncrypt(src, key) {
  key = CryptoJS.enc.Hex.parse(key)
  src = CryptoJS.enc.Hex.parse(src)
  let encoded = CryptoJS.DES.encrypt(src, key, options_no)
  let result = encoded.ciphertext.toString()  //默认hex编码
  return result
}

/**
 * des解密，encoded为加密16进制串
 * encoded : 16进制加密字符串
 * key : 16进制秘钥
 */
function desDecrypt(encoded, key) {
  key = CryptoJS.enc.Hex.parse(key)
  let decoded = CryptoJS.DES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(encoded) }, key, options_no)
  return decoded
}

/**
 * base64加密
 */
function base64Encrypt(src) {
  let str = CryptoJS.enc.Utf8.parse(src)
  let result = CryptoJS.enc.Base64.stringify(str)
  console.log('base64加密后：' + result)
  return result
}

/**
 * string 2 hex ascii
 */
function string2hex(str) {
  let val = ""
  for (let i = 0; i < str.length; i++) {
    val += str.charCodeAt(i).toString(16)
  }
  return val
}

/**
 * string 2 binary ascii
 */
function string2binary(str) {
  let val = ""
  for (let i = 0; i < str.length; i++) {
    val += str.charCodeAt(i).toString(2)
  }
  console.log('[' + str + ']' + '转2进制串：' + val)
  return val
}

/**
 * ascii hex 2 string
 */
function hex2string(hex) {
  let val = ""
  for (let i = 0; i < hex.length / 2; i++) {
    val += String.fromCharCode(parseInt(hex.substring(2 * i, 2 * i + 2), 16))
  }
  console.log('16进制转字符串：' + hex + '->' + val)
  return val
}

/**
 * ascii binary 2 string
 */
function binary2string(binary) {
  let val = ""
  for (let i = 0; i < binary.length / 8; i++) {
    val += String.fromCharCode(parseInt(binary.substring(8 * i, 8 * i + 8), 2))
  }
  console.log('2进制转字符串：' + hex + '->' + val)
  return val
}

/**
 * hex string 2 byte array
 */
function hexString2ByteArray(hex) {
  let b = new Array()
  for (let i = 0; i < hex.length / 2; i++) {
    b.push(parseInt(hex.substring(2 * i, 2 * i + 2), 16))
  }
  return b
}

/**
 * byte array 2 hex string
 */
function byteArray2hexString(b) {
  let s = ""
  for (let i = 0; i < b.length; i++) {
    let tmp = b[i].toString(16)
    if (tmp.length == 1) {
      tmp = "0" + tmp
    }
    s += tmp
  }
  return s
}

module.exports = {
  aesEncrypt: aesEncrypt,
  aesDecrypt: aesDecrypt,
  desEncrypt: desEncrypt,
  desDecrypt: desDecrypt,
  string2hex: string2hex,
  hex2string: hex2string,
  str2binary: string2binary,
  binary2string: binary2string,
  hexString2ByteArray: hexString2ByteArray,
  byteArray2hexString: byteArray2hexString,
  base64Encrypt: base64Encrypt
}