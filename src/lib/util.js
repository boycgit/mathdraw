import shortid from 'shortid';
import {debug, debugMini, debugError} from './debug'

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_');

function uuid(len = 5){
    return shortid.generate().slice(0, len); // id 截断处理
}


function invariant(check, message, thing) {
    if (!check) {
        throw new Error("[ide-view] Invariant failed: " + message + (thing ? " in '" + thing + "'" : ""));
    }
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function beautyJsonString(str) {
    try {
        var obj = JSON.parse(str);
        return JSON.stringify(obj, null, 2);
    } catch (e) {
        return str;
    }
}

function minifyJsonString(str){
    try {
        var obj = JSON.parse(str);
        return JSON.stringify(obj, null, 0);
    } catch (e) {
        return str;
    }
}

function isTrue(val) {
    return val === 'true' || val === true;
}

function parseOrFalse(str){
    var json = {}
    try{
      if(str.length){
        json = JSON.parse(str);
        debugMini('=====> 将字符串解析成 JSON 成功');
        debug('=====> 获得的 JSON 的内容：'+json);
  
        return json;
      } else {
        return false;
      }
    } catch(err) {
      debugError('=====> 将字符串解析成 JSON 失败：',err);
      debugError('=====> 原字符串内容：'+str);
  
      return false;
    }
  }
  
function parseUrl(str){
    let url = document.createElement('a');
    url.href = str;
    return url;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function isExist(val) {
    return typeof val !== 'undefined' &&  val !== null
}

// 尾递归优化函数，参考：https://juejin.im/entry/592e8a2d0ce463006b510b34
function tailCallOptimize(f, label='tail') {  
    let value
    let active = false
    const accumulated = []
    return function accumulator() {
      accumulated.push(arguments);
      if (!active) {
        active = true
        console.time(label);
        while (accumulated.length) {
            // console.log('3333',accumulated.length, accumulated[0]);
            value = f.apply(this, accumulated.shift());
            // console.log('3344',accumulated.length, accumulated[0]);
        }
        console.timeEnd(label);
        active = false
        return value
      }
    }
  }


// https://github.com/lodash/lodash/blob/3.0.8-npm-packages/lodash.isfunction/index.js
var funcTag = '[object Function]', genTag = '[object GeneratorFunction]';
var objectToString = Object.prototype.toString;
function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}
function isFunction(value){
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
}


const isDev = isTrue(getParameterByName('ide-debug'))

// 获取 id 匹配规则
const getIdRegex = id =>{
    invariant(!!id && id.indexOf('$') === 0, 'id 必须要以 $ 符号开始');
    return new RegExp(id.replace('$', '\\$'), 'g'); 
}

export {
    isDev,
    isJsonString,
    isFunction,
    minifyJsonString,
    beautyJsonString,
    invariant,
    isExist,
    isTrue,
    parseUrl,
    shortid,
    uuid,
    getParameterByName,
    tailCallOptimize,
    getIdRegex,
    parseOrFalse
}