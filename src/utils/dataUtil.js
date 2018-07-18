function sortByPinYin(arr) {
  arr.sort(
    function compareFunction(param1, param2) {
      return param1.localeCompare(param2)
    }
  )
  return arr
}

function pySegSort(arr) {
  if(!String.prototype.localeCompare)
    return null

  let letters = '*abcdefghjklmnopqrstwxyz'.split('')
  let zh = '阿八嚓哒妸发旮哈讥咔垃麻拏噢妑七呥扨它穵夕丫帀'.split('')

  let segs = []
  let curr
  letters.forEach(function(item,i){
    curr = {letter: item, data:[]}
    arr.forEach(function(item2){
      if((!zh[i-1] || zh[i-1].localeCompare(item2) <= 0) && item2.localeCompare(zh[i]) == -1) {
        curr.data.push(item2)
      }
    })
    if(curr.data.length) {
      segs.push(curr)
      curr.data.sort(function(a,b){
        return a.localeCompare(b)
      })
    }
  })
  return segs
}

function formatPhone(value) {
  return value.replace(/[&\|\\\*^%$#@\-\(\)\s]/g,'')
}

function checkMobile(value){
  if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))){
    return false
  }
  return true
}

function CheckTel(value){//电话验证
  let reg=/^([0-9]|[-])+$/g
  let isValid
  isValid=reg.exec(value)
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

export default {
  sortByPinYin,
  pySegSort,
  formatPhone,
  checkMobile,
  CheckTel,
  getType,
}