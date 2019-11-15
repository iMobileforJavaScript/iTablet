import { getLanguage } from '../language'

function sortByPinYin(arr) {
  arr.sort(function compareFunction(param1, param2) {
    return param1.localeCompare(param2)
  })
  return arr
}

function pySegSort(arr) {
  if (!String.prototype.localeCompare) return null

  let letters = '*abcdefghjklmnopqrstwxyz'.split('')
  let zh = '阿八嚓哒妸发旮哈讥咔垃麻拏噢妑七呥扨它穵夕丫帀'.split('')

  let segs = []
  let curr
  letters.forEach(function(item, i) {
    curr = { letter: item, data: [] }
    arr.forEach(function(item2) {
      if (
        (!zh[i - 1] || zh[i - 1].localeCompare(item2) <= 0) &&
        item2.localeCompare(zh[i]) === -1
      ) {
        curr.data.push(item2)
      }
    })
    if (curr.data.length) {
      segs.push(curr)
      curr.data.sort(function(a, b) {
        return a.localeCompare(b)
      })
    }
  })
  return segs
}

function formatPhone(value) {
  return value.replace(/[&|\\*^%$#@\-()\s]/g, '')
}

function checkMobile(value) {
  if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(value)) {
    return false
  }
  return true
}

function CheckTel(value) {
  //电话验证
  let reg = /^([0-9]|[-])+$/g
  let isValid
  isValid = reg.exec(value)
  if (!isValid) {
    return false
  }
  return true
}

const DataType = {
  '[object String]': 'String',
  '[object Number]': 'Number',
  '[object Boolean]': 'Boolean',
  '[object Undefined]': 'Undefined',
  '[object Null]': 'Null',
  '[object Function]': 'Function',
  '[object Date]': 'Date',
  '[object Array]': 'Array',
  '[object RegExp]': 'RegExp',
  '[object Error]': 'Error',
  '[object HTMLDocument]': 'HTMLDocument',
  '[object global]': 'global',
}

function getType(data) {
  let type = Object.prototype.toString.call(data)
  return DataType[type]
}

function colorRgba(str, n = 1) {
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let sColor = str.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        //例如：#eee,#fff等
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    let sColorChange = {}
    for (let i = 1; i < 7; i += 2) {
      let key = i === 1 ? 'r' : i === 3 ? 'g' : 'b'
      sColorChange[key] = parseInt('0x' + sColor.slice(i, i + 2))
    }
    sColorChange['a'] = n
    return sColorChange
  } else {
    return sColor
  }
}

function checkColor(str) {
  let reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  return reg.test(str)
}

function colorHex(obj) {
  return (
    '#' +
    ((1 << 24) + (obj.r << 16) + (obj.g << 8) + obj.b).toString(16).slice(1)
  )
}

const chnNumChar = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
}
const chnNameValue = {
  十: { value: 10, secUnit: false },
  百: { value: 100, secUnit: false },
  千: { value: 1000, secUnit: false },
  万: { value: 10000, secUnit: true },
  亿: { value: 100000000, secUnit: true },
}
function ChineseToNumber(chnStr) {
  let rtn = 0
  let section = 0
  let number = 0
  let secUnit = false
  let str = chnStr.split('')
  for (let i = 0; i < str.length; i++) {
    let num = chnNumChar[str[i]]
    if (typeof num !== 'undefined') {
      number = num
      if (i === str.length - 1) {
        section += number
      }
    } else {
      let unit = chnNameValue[str[i]].value
      secUnit = chnNameValue[str[i]].secUnit
      if (secUnit) {
        section = (section + number) * unit
        rtn += section
        section = 0
      } else {
        section += (number + (i === 0 ? 1 : 0)) * unit
      }
      number = 0
    }
  }
  return rtn + section
}

//数字加上千分位符号
function NumberWithThousandSep(nummber, fix = 2, ellipsisZero = true) {
  let num = (nummber || 0).toString()
  if (fix >= 0 && num.indexOf('.') !== -1) {
    nummber = nummber.toFixed(fix)
    num = (nummber || 0).toString()
  }
  let int = num
  let decimal = ''
  if (num.indexOf('.') !== -1) {
    int = num.substr(0, num.indexOf('.'))
    decimal = num.substr(num.indexOf('.') + 1)
    if (ellipsisZero && parseInt(decimal) === 0) {
      decimal = ''
    }
  }
  let result = ''
  while (int.length > 3) {
    result = ',' + int.slice(-3) + result
    int = int.slice(0, int.length - 3)
  }
  if (int) {
    result = int + result
  }
  if (fix !== 0 && decimal !== '') {
    result = result + '.' + decimal
  }
  return result
}

function angleTransfer(value = 0, decimals = -1) {
  let degrees,
    minutes,
    seconds,
    temp = value
  degrees = Math.floor(temp)

  temp = (temp - degrees) * 60
  minutes = Math.floor(temp)

  temp = (temp - minutes) * 60
  seconds = temp
  if (decimals >= 0) {
    seconds = seconds.toFixed(decimals)
  }
  return degrees + '°' + minutes + "'" + seconds + '"'
}

/**
 * 数组元素交换位置
 * @param {array} arr 数组
 * @param {number} index1 添加项目的位置
 * @param {number} index2 删除项目的位置
 * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
 */
function swapArray(arr = [], index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

/**
 * 深拷贝一个对象
 * @param obj
 * @returns {{}}
 */
function cloneObj(obj) {
  let newObj = {}
  if (obj instanceof Array) {
    newObj = []
  }
  for (let key in obj) {
    let val = obj[key]
    newObj[key] = typeof val === 'object' ? cloneObj(val) : val
  }
  return newObj
}

//获取不带后缀的文件名
function getFileNameWithOutExt(text) {
  let json = text.split('.')
  return text.replace('.' + json[json.length - 1], '')
}

//检查ip+port是否合法
function checkIpPort(ip) {
  let re = /^(\d+)\.(\d+)\.(\d+)\.(\d+):(\d{3,4})$/ //正则表达式
  if (re.test(ip)) {
    if (
      RegExp.$1 < 256 &&
      RegExp.$2 < 256 &&
      RegExp.$3 < 256 &&
      RegExp.$4 < 256
    )
      return true
  }
  return false
}

//获取合法命名
function getLegalName(text = '', re = '') {
  if (text.length === 0) return text
  let res = text.trim()
  res = res.replace(/^[\d+|_+|@|#]+/, '') // 去掉字符串首部命名不合法
  res = res.replace(/^[^a-zA-Z]+/, '') // 去掉字符串首部命名不合法
  if (re) {
    res = res.replace(re, '')
  } else {
    res = res.replace(
      /\^|\.|\*|\?|!|\/|\\|\$|&|\||,|\[|]|{|}|\(|\)|\+|=|——|《|》|<|>|\/|\s|:|;|,|。|，|？|【|】|「|」|·|`|‘|’|“|0”|%/g,
      '',
    )
  }
  return res
}

//检查命名是否合法
function isLegalName(text = '', language = 'CN') {
  if (text.length === 0)
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_EMPTY,
    }
  let re = /^[0-9a-zA-Z_\u4e00-\u9fa5@#_]+$/
  let re1 = /^[a-zA-Z\u4e00-\u9fa5]/ // 判断首字母
  if (!re1.test(text)) {
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_START_WITH_A_LETTER,
    }
  }
  if (!re.test(text)) {
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_ILLEGAL_CHARACTERS,
    }
  }
  return {
    result: true,
  }
}

function isLegalURL(URL, language = 'CN') {
  let str = URL
  let Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
  let objExp = new RegExp(Expression)

  if (!objExp.test(str)) {
    return {
      result: false,
      error: getLanguage(language).Prompt.ERROR_INFO_INVALID_URL,
    }
  }

  return {
    result: true,
  }
}

function getNameByURL(str) {
  var idx = str.lastIndexOf('/')
  idx = idx > -1 ? idx : str.lastIndexOf('\\')
  if (idx < 0) {
    return str
  }
  let file = str.substring(idx + 1)
  let arr = file.split('.')
  return arr[0]
}

export default {
  sortByPinYin,
  pySegSort,
  formatPhone,
  checkMobile,
  CheckTel,
  getType,
  colorRgba,
  colorHex,
  ChineseToNumber,
  NumberWithThousandSep,
  checkColor,
  angleTransfer,
  swapArray,
  cloneObj,
  getFileNameWithOutExt,
  checkIpPort,
  getLegalName,

  isLegalName,
  isLegalURL,

  getNameByURL,
}
