/**
 * Created By Asort 2019/02/01
 */
(function(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      if (clientWidth > 1280) clientWidth = 1280
      docEl.style.fontSize =
        clientWidth / 10 > 128 ? 128 + 'px' : clientWidth / 10 + 'px'
    }
  //eslint-disable-next-line
  addEvent = function(el, type, fn, useCapture) {
    useCapture = useCapture || false
    if (el.addEventListener) {
      el.addEventListener(type, fn, useCapture)
    } else {
      el.attachEvent('on' + type, fn)
    }
  }
  if (doc.addEventListener) {
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
  } //eslint-disable-next-line
  addEvent(win, resizeEvt, recalc, false)
  //eslint-disable-next-line
  addEvent(doc, 'DOMContentLoaded', recalc, false)
})(document, window)
