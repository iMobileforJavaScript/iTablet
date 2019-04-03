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
  static getFindUserZipDataUrl = async (nickname, keyword) => {
    let url
    try {
      let time = new Date().getTime()
      let uri = `https://www.supermapol.com/web/datas.json?currentPage=1&keywords=["${keyword}"]&filterFields=%5B%22FILENAME%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&t=${time}`
      let objFindUserZipData = await FetchUtils.getObjJson(uri)
      let arrContent = objFindUserZipData.content
      let findDataId
      for (let i = 0; i < arrContent.length; i++) {
        let objContent = arrContent[i]
        let fileName = keyword + '.zip'
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
}
