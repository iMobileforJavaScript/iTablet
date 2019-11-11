import Toast from 'react-native-root-toast'

function show(msg, option = null) {
  let op = Object.assign(
    {
      duration: DURATION.TOAST_SHOT,
      position: POSITION.TOP,
      shadow: true,
      animation: true,
      delay: 0,
    },
    option,
  )
  Toast.show(msg, op)
}

const DURATION = {
  TOAST_SHOT: 2000,
  TOAST_LONG: 3500,
}

const POSITION = {
  CENTER: Toast.positions.CENTER,
  // TOP: Toast.positions.TOP,
  TOP: 100,
  BOTTOM: Toast.positions.BOTTOM,
}

export default {
  show,
  DURATION,
  POSITION,
}
