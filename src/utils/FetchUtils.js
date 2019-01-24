import Toast from './Toast'

export default class FetchUtils {
  /* 获取url的json串对象*/
  static getObjJson = url => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(result => {
          resolve(result)
        })
        .catch(error => reject(error))
    })
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
