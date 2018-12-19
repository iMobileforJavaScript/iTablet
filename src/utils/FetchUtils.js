export default class FetchUtils {
  /* 获取url的json串对象*/
  static getObjJson(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(result => {
          resolve(result)
        })
        .catch(error => reject(error))
    })
  }
}
