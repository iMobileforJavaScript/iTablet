global.language = 'CN'
global.APP_VERSION = 'V3.0.9_20200221'
function getLanguage(param) {
  let language = {}
  switch (param) {
    case 'CN':
      language = require('./CN/index').default
      break
    case 'EN':
      language = require('./EN/index').default
      break
    case 'TR':
      language = require('./TR/index').default
      break
    case 'JA':
      language = require('./JA/index').default
      break
  }
  return language
}

export { getLanguage }
