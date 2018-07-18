import Toast from 'react-native-root-toast'

function show(msg, option = null) {
  let op = option || {
    duration: Toast.TOAST_SHOT,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    delay: 0,
  }
  Toast.show(msg, op)
}

const DURATION = {
  TOAST_SHOT: 2000,
  TOAST_LONG: 3500,
}

const POSITION = {
  CENTER: Toast.positions.CENTER,
  TOP: Toast.positions.TOP,
  BOTTOM: Toast.positions.BOTTOM,
}

export default {
  show,
  DURATION,
  POSITION,
}