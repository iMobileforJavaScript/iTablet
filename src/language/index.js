
global.language ='CN'

function getLanguage(param) {
    let language = {}
    switch (param) {
      case 'CN':
      language = require('./CN').default
        break
      case 'EN':
      language = require('./EN').default
        break
    }
    return language
  }

export  {
    getLanguage
}