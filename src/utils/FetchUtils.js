import Toast from './Toast'

export default class FetchUtils {
  /*
   *获取url的json串对象
   */
  static getObjJson = (url, timeout) => {
    try {
      if (!timeout) {
        return new Promise(resolve => {
          fetch(url, {})
            .then(response => response.json())
            .then(result => {
              resolve(result)
            })
            .catch(() => ({}))
        })
      } else {
        const request = new Promise(resolve => {
          fetch(url)
            .then(response => response.json())
            .then(result => {
              resolve(result)
            })
            .catch(() => ({}))
        })
        const timeoutRequest = new Promise((resolve, reject) => {
          setTimeout(reject, timeout, 'Request time out')
        })
        return Promise.race([request, timeoutRequest]).then(
          res => {
            return res
          },
          () => ({}),
        )
      }
    } catch (e) {
      return {}
    }
  }
  /** 获取用户数据的下载url*/
  static getFindUserDataUrl = async (nickname, keyword, type) => {
    let url
    try {
      let time = new Date().getTime()
      let uri = `https://www.supermapol.com/web/datas.json?currentPage=1&keywords=["${keyword}"]&filterFields=%5B%22FILENAME%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&t=${time}`
      let objFindUserZipData = await FetchUtils.getObjJson(uri)
      let arrContent = objFindUserZipData.content
      let findDataId
      for (let i = 0; i < arrContent.length; i++) {
        let objContent = arrContent[i]
        let fileName = keyword + type
        if (
          nickname === objContent.nickname &&
          fileName === objContent.fileName
        ) {
          findDataId = objContent.id
          break
        }
      }
      url = `https://www.supermapol.com/web/datas/${findDataId}/download`
    } catch (e) {
      Toast.show('网络错误')
    }
    return url
  }

  /****** 在线路径分析 *******/
  static routeAnalyst = async (startX, startY, endX, endY) => {
    let data
    try {
      let params = `{startPoint:{"x":${startX},"y":${startY}},endPoint:{"x":${endX},"y":${endY}},routeType:MINLENGTH,to:910111}`
      let url = `http://www.supermapol.com/iserver/services/navigation/rest/navigationanalyst/China/pathanalystresults.json?pathAnalystParameters=[${params}]&key=fvV2osxwuZWlY0wJb8FEb2i5`
      data = await FetchUtils.getObjJson(url)
    } catch (e) {
      Toast.show('网络错误')
    }
    return data
  }

  /****** 逆地理编码 *******/
  static getPointName = async (x, y) => {
    let data
    try {
      let url = `http://www.supermapol.com/iserver/services/location-china/rest/locationanalyst/China/geodecoding.json?location={"x":${x},"y":${y}}&key=fvV2osxwuZWlY0wJb8FEb2i5`
      let rel = await FetchUtils.getObjJson(url)
      data = rel.formatedAddress
    } catch (e) {
      Toast.show('网络错误')
    }
    return data
  }
}
