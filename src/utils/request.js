export default function request(url, method = 'GET', { body, headers }) {
  let extraData = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: method,
  }

  if (headers) {
    extraData.headers = Object.assign(extraData.headers, headers)
  }

  if (method === 'POST' && body) {
    extraData = Object.assign(extraData, { body: JSON.stringify(body) })
  }

  if (method === 'PUT' && body) {
    extraData = Object.assign(extraData, { body: JSON.stringify(body) })
  }

  return fetch(url, extraData)
    .then(response => {
      let map = response.headers.map
      if (map['set-cookie']) {
        global.cookie = map['set-cookie']
      }
      return response.json()
    })
    .then(responseJson => {
      return responseJson
    })
    .catch(() => {
      global.cookie = ''
    })
}
