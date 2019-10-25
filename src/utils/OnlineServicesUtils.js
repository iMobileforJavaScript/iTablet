import { request } from './index'
import cheerio from 'react-native-cheerio'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import { Platform } from 'react-native'
import axios from 'axios'
// eslint-disable-next-line import/default
import CookieManager from 'react-native-cookies'

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
    if (result.total === 1) {
      return result.content[0].id
    }
    return undefined
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
  getUserInfo = async userName => {
    try {
      let url =
        'https://www.supermapol.com/web/users/online.json?nickname=' + userName
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
}
