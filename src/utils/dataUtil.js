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
        item2.localeCompare(zh[i]) == -1
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

function angleTransfer(value = 0, decimals = -1) {
  let degrees,
    minutes,
    seconds,
    temp = value
  degrees = temp.toFixed() - 1 + 1

  temp = (temp - degrees) * 60
  minutes = Math.floor(temp)

  temp = (temp - minutes) * 60
  seconds = temp
  if (decimals >= 0) {
    seconds = seconds.toFixed(decimals)
  }
  return degrees + '°' + minutes + "'" + seconds + '"'
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
  checkColor,
  angleTransfer,
}
