import { request } from './index'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import { Platform } from 'react-native'

export default class OnlineServicesUtils {
  constructor(type) {
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
      this.serverUrl = 'https://www.supermapol.com/web/'
      if (Platform.OS === 'android') {
        SOnlineService.getAndroidSessionID().then(cookie => {
          this.cookie = cookie
        })
      }
    }
  }

  async publishService(id) {
    let url =
      this.serverUrl +
      `/mycontent/datas/${id}/publishstatus.rjson?serviceType=RESTMAP,RESTDATA`
    let headers = {}
    if (this.cookie) {
      headers = {
        cookie: this.cookie,
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
    return await this.publishService(id)
  }

  async getDataIdByName(dataName) {
    let url =
      this.serverUrl +
      `/mycontent/datas.rjson?keywords=[${dataName}]&filterFields=["FILENAME"]`
    let headers = {}
    if (this.cookie) {
      headers = {
        cookie: this.cookie,
      }
    }
    let result = await request(url, 'GET', {
      headers: headers,
      body: true,
    })
    if (result.total === 1) {
      return result.content[0].id
    }
    return undefined
  }

  async setServicesShareConfig(id, isPublic) {
    let url = this.serverUrl + `/services/sharesetting.rjson`
    let headers = {}
    if (this.cookie) {
      headers = {
        cookie: this.cookie,
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
    if (this.cookie) {
      headers = {
        cookie: this.cookie,
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
}
