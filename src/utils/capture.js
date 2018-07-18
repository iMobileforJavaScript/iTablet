import { captureScreen as cs, captureRef } from "react-native-view-shot"

function captureScreen(params, successCb, errorCb) {
  let option = {
    format: "png",
    quality: 0.5,
  }
  Object.assign(option, params)
  cs(option)
    .then(
      uri => {
        successCb && successCb(uri)
      },
      error => {
        errorCb && errorCb(error)
      }
    )
}

function snapshot (refname, params, successCb, errorCb) {
  let option = {
    format: "png",
    quality: 0.5,
    result: "tmpfile",
    snapshotContentContainer: true,
  }
  Object.assign(option, params)
  captureRef(refname, option)
    .then(
      uri => {
        successCb && successCb(uri)
      },
      error => {
        errorCb && errorCb(error)
        console.log(error)
      }
    )
}

export default {
  captureScreen,
  snapshot,
}
