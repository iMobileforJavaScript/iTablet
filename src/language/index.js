global.language = 'CN'

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
