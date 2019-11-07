/**
 * 自定义Array实例方法
 */
export default (function() {
  /** 克隆一个新的MaArray，并且内部所有键值对都是新的 **/
  Array.prototype.clone = function() {
    return [].concat(this)
  }
})
