/**
 * 自定义Map实例方法
 */
export default (function() {
  /** 克隆一个新的Map，并且内部所有键值对都是新的 **/
  Map.prototype.clone = function(data) {
    this.clear()
    const iterator = data.keys()
    let key = iterator.next().value
    while (key !== undefined) {
      let itemKey = key
      let item = data.get(key)
      if (typeof itemKey === 'object') {
        itemKey = JSON.parse(JSON.stringify(itemKey))
      }
      if (typeof item === 'object') {
        item = JSON.parse(JSON.stringify(item))
      }
      this.set(itemKey, item)
      key = iterator.next().value
    }
    return this
  }

  /** 相同则返回true **/
  Map.prototype.compare = function(data) {
    let isSame = true
    if (this.size !== data.size) {
      return false
    }
    const iterator = data.keys()
    let key = iterator.next().value
    while (key !== undefined) {
      isSame =
        isSame &&
        JSON.stringify(this.get(key)) !== JSON.stringify(data.get(key))
      if (!isSame) {
        return isSame
      }
    }
    return isSame
  }
})
