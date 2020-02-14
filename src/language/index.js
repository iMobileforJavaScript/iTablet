global.language = 'CN'
global.APP_VERSION = 'V3.0.6_20191230'
function getLanguage(param) {
  let language = {}
  switch (param) {
    case 'CN':
      language = require('./CN/index').default
      break
    case 'EN':
      language = require('./EN/index').default
      break
  }
  return language
}

export { getLanguage }
