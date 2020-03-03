import { request } from './index'
import cheerio from 'react-native-cheerio'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import { Platform } from 'react-native'
import axios from 'axios'
// eslint-disable-next-line import/default
import CookieManager from 'react-native-cookies'
import RNFS from 'react-native-fs'

export default class OnlineServicesUtils {
  constructor(type) {
    this.type = type
    if (type === 'iportal') {
      let url = SIPortalService.getIPortalUrl()
      if (url) {
        this.serverUrl = url
        if (url.indexOf('http') !== 0) {
          this.serverUrl = 'http://' + url
        }
        if (Platform.OS === 'android') {
          SIPortalService.getIPortalCookie().then(cookie => {
            this.cookie = cookie
          })
        }
      }
    }
    if (type === 'online') {
      this.serverUrl = 'https://www.supermapol.com/web'
      if (Platform.OS === 'android') {
        SOnlineService.getAndroidSessionID().then(cookie => {
          this.cookie = cookie
        })
      }
    }
  }

  getCookie = async () => {
    if (Platform.OS === 'ios') {
      return undefined
    }
    if (this.cookie) {
      return this.cookie
    }

    let cookie = undefined
    if (this.type === 'iportal') {
      cookie = await SIPortalService.getIPortalCookie()
    } else if (this.type === 'online') {
      cookie = await SOnlineService.getAndroidSessionID()
    }

    this.cookie = cookie
    return cookie
  }

  async publishService(id) {
    let url =
      this.serverUrl +
      `/mycontent/datas/${id}/publishstatus.rjson?serviceType=RESTMAP,RESTDATA`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let result = await request(url, 'PUT', {
      headers: headers,
      body: true,
    })
    return result.succeed
  }

  async publishServiceByName(dataName) {
    let id = await this.getDataIdByName(dataName)
    if (id) {
      return await this.publishService(id)
    } else {
      return false
    }
  }

  async getDataIdByName(dataName) {
    let url = this.serverUrl + `/mycontent/datas.rjson?fileName=${dataName}`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let result = await request(url, 'GET', {
      headers: headers,
    })
    if (result && result.total === 1) {
      return result.content[0].id
    }
    return undefined
  }

  async getService(id) {
    let url = this.serverUrl + `/services.rjson?ids=[${id}]`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }

    let result = await request(url, 'GET', {
      headers: headers,
    })
    if (result && result.total === 1) {
      return result.content[0]
    }
    return false
  }

  async setServicesShareConfig(id, isPublic) {
    let url = this.serverUrl + `/services/sharesetting.rjson`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let entities
    if (isPublic) {
      entities = [
        {
          entityType: 'USER',
          entityName: 'GUEST',
          permissionType: 'READ',
        },
      ]
    } else {
      entities = []
    }
    let result = await request(url, 'PUT', {
      headers: headers,
      body: {
        ids: [id],
        entities: entities,
      },
    })
    return result.succeed
  }

  async setDatasShareConfig(id, isPublic) {
    let url = this.serverUrl + `/mycontent/datas/sharesetting.rjson`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let entities
    if (isPublic) {
      entities = [
        {
          entityType: 'USER',
          entityName: 'GUEST',
          dataPermissionType: 'DOWNLOAD',
        },
      ]
    } else {
      entities = []
    }
    let result = await request(url, 'PUT', {
      headers: headers,
      body: {
        ids: [id],
        entities: entities,
      },
    })
    return result.succeed
  }

  async uploadFile(filePath, fileName, fileType, callback) {
    try {
      let id = await this._getUploadId(fileName, fileType)
      if (id) {
        let url = this.serverUrl + `/mycontent/datas/${id}/upload.rjson`
        let headers = {}
        let cookie = await this.getCookie()
        if (cookie) {
          headers = {
            cookie: cookie,
          }
        }
        let uploadParams = {
          toUrl: url,
          headers: headers,
          files: [
            {
              name: fileName,
              filename: fileName,
              filepath: filePath,
            },
          ],
          background: true,
          method: 'POST',
          begin: res => {
            if (callback && typeof callback.onBegin === 'function') {
              callback.onBegin(res)
            }
          },
          progress: res => {
            if (callback && typeof callback.onProgress === 'function') {
              callback.onProgress(res)
            }
          },
        }

        let result = await RNFS.uploadFiles(uploadParams).promise
        let body = JSON.parse(result.body)
        return body.childID !== undefined
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  async _getUploadId(fileName, fileType) {
    try {
      let url = this.serverUrl + `/mycontent/datas.rjson`
      let headers = {}
      let cookie = await this.getCookie()
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }
      let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          fileName: fileName,
          type: fileType,
        }),
      })
      let result = await response.json()
      if (result.childID) {
        return result.childID
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  /************************ 公共数据相关（不用登陆） ******************************/

  /**
   * 通过用户id和文件名查询数据
   * @param {*} userName 用户id
   * @param {*} fileName 文件名
   */
  async getPublicDataByName(userName, fileName) {
    let url =
      this.serverUrl + `/datas.rjson?userName=${userName}&fileName=${fileName}`

    let response = await fetch(url)
    let responseObj = await response.json()

    if (responseObj && responseObj.total === 1) {
      return responseObj.content[0]
    } else {
      return false
    }
  }

  /**
   * 根据类型查找数据
   * @param {*} types 类型数组
   * @param {*} orderBy
   */
  async getPublicDataByTypes(types, params) {
    let { orderBy, orderType, pageSize, currentPage, keywords } = { ...params }
    orderBy = orderBy || 'LASTMODIFIEDTIME'
    orderType = orderType || 'DESC'
    pageSize = pageSize || 9
    currentPage = currentPage || 1
    let url
    if (!types || types.length === 0) {
      url = this.serverUrl + `/datas.rjson?`
    } else if (types.length === 1) {
      url = this.serverUrl + `/datas.rjson?type=${types[0]}`
    } else {
      url = this.serverUrl + `/datas.rjson?types=[${types}]`
    }

    url += `&orderBy=${orderBy}&orderType=${orderType}`
    url += `&pageSize=${pageSize}&currentPage=${currentPage}`
    if (keywords) {
      url += `&keywords=${keywords}`
    }

    let response = await fetch(url)
    let responseObj = await response.json()

    if (responseObj) {
      return responseObj
    } else {
      return false
    }
  }
  /************************ 公共数据相关（不用登陆）end ***************************/

  /************************ online账号相关 ***********************/
  async login(userName, password, loginType) {
    if (this.type === 'online') {
      try {
        let url =
          'https://sso.supermap.com/login?service=https://www.supermapol.com/shiro-cas'

        await CookieManager.clearAll()
        //请求登陆页面
        let response = await axios.get(url)
        let $ = cheerio.load(response.data)
        let cookie
        if (response.headers['set-cookie']) {
          cookie = response.headers['set-cookie'][0]
          cookie = cookie.substr(0, cookie.indexOf(';'))
        }

        let paramObj = {
          loginType: loginType,
          username: userName,
          password: password,
          lt: $('input[name=lt]').attr().value,
          execution: $('input[name=execution]').attr().value,
          _eventId: $('input[name=_eventId]').attr().value,
          // submit: '登录',
        }
        let paramStr
        if (Platform.OS === 'android') {
          paramStr = JSON.stringify(paramObj)
        } else {
          paramStr = this._obj2params(paramObj)
        }
        let result = await SOnlineService.loginWithParam(url, cookie, paramStr)
        this.cookie = await SOnlineService.getCookie()

        return result
      } catch (e) {
        return false
      }
    }
  }

  _obj2params(obj) {
    var result = ''
    var item
    for (item in obj) {
      result += '&' + item + '=' + encodeURIComponent(obj[item])
    }

    if (result) {
      result = result.slice(1)
    }

    return result
  }

  /**
   * 获取用户信息，未登陆时获取nickname和id
   * 登陆后还可获取相应账号的phone和email
   * @param userName 可以是id，nickname，phone或email
   */
  getUserInfo = async (userName, isEmail) => {
    try {
      let url
      if (isEmail) {
        url =
          'https://www.supermapol.com/web/users/online.json?nickname=' +
          userName
      } else {
        url =
          'https://www.supermapol.com/web/users/online.json?phoneNumber=' +
          userName
      }
      let headers = {}
      let cookie = await this.getCookie()
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }

      let response = await fetch(url, {
        headers: headers,
      })
      if (response.status === 200) {
        let result = await response.json()

        return {
          userId: result.name,
          nickname: result.nickname,
          phoneNumber: result.phoneNumber,
          email:
            (result.email && result.email.indexOf('@isupermap.com')) === -1
              ? result.email
              : null,
        }
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  /**
   * 手机注册
   */
  loadPhoneRegisterPage = async () => {
    try {
      let url =
        'https://sso.supermap.com/phoneregister?service=http://www.supermapol.com'
      await CookieManager.clearAll()
      let response = await axios.get(url)
      let registerPage = cheerio.load(response.data)
      let cookie
      if (Platform.OS === 'android' && response.headers['set-cookie']) {
        cookie = response.headers['set-cookie'][0]
        cookie = cookie.substr(0, cookie.indexOf(';'))
      }
      this.registerPage = registerPage
      this.registerCookie = cookie
    } catch (e) {
      return
    }
  }

  sendSMSVerifyCode = async phoneNumber => {
    try {
      let url =
        'https://sso.supermap.com/phoneregister?service=http://www.supermapol.com'
      let paramObj = {
        phoneNumber: phoneNumber,
        execution: this.registerPage('input[name=execution]').attr().value,
        _eventId_send: this.registerPage('input[name=_eventId_send]').attr()
          .value,
      }
      let paramStr = this._obj2params(paramObj)
      let registerResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Cookie: this.registerCookie,
        },
        body: paramStr,
      })
      let responsedata = await registerResponse.text()
      let page = cheerio.load(responsedata)
      this.registerPage = page
      try {
        return page('.sso_tip_block').text()
      } catch (e) {
        return true
      }
    } catch (e) {
      return false
    }
  }

  register = async (type, param) => {
    try {
      let url
      if (type === 'phone') {
        url =
          'https://sso.supermap.com/phoneregister?service=http://www.supermapol.com'
        let paramObj = {
          nickname: param.nickname,
          realName: param.realName,
          company: param.company,
          email: param.email,
          password: param.password,
          phoneNumber: param.phoneNumber,
          SMSVerifyCode: param.SMSVerifyCode,
          execution: this.registerPage('input[name=execution]').attr().value,
          _eventId_register: this.registerPage(
            'input[name=_eventId_register]',
          ).attr().value,
        }
        let paramStr = this._obj2params(paramObj)
        let AcceptLanguage
        if (global.language === 'CN') {
          AcceptLanguage = 'zh-CN,zh;q=0.9,ja;q=0.8,en;q=0.7'
        } else {
          AcceptLanguage = 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'
        }
        let registerResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie: this.registerCookie,
            'Accept-Language': AcceptLanguage,
          },
          body: paramStr,
        })
        let responsedata = await registerResponse.text()
        let page = cheerio.load(responsedata)
        this.registerPage = page
        try {
          let errorText = page('.sso_tip_block').text()
          if (errorText !== '') {
            return errorText
          } else {
            return true
          }
        } catch (e) {
          return true
        }
      }
    } catch (e) {
      return false
    }
  }
}
