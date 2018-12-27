import { Dimensions, Platform, PixelRatio } from 'react-native'
import { scaleSize } from '../utils'

const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  onePixel: 1 / 2,
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
}
let fontScale = PixelRatio.getFontScale()
let pixelRatio = PixelRatio.get()
const defaulPixel = 2
const w2 = 720 / defaulPixel
const h2 = 1080 / defaulPixel
const scale = Math.min(screen.width / w2, screen.height / h2)
const fontSize = {
  fontSizeXXl: scaleSize(28),
  fontSizeXl: scaleSize(26),
  fontSizeLg: scaleSize(24),
  fontSizeMd: scaleSize(22),
  fontSizeSm: scaleSize(20),
  fontSizeXs: scaleSize(18),
}

const layoutSize = {
  horizonWidth: 15,
  verticalHeight: 15,
}

function setSpText(size) {
  size = Math.round(((size * scale + 0.5) * pixelRatio) / fontScale)
  return size / defaulPixel
}

export default {
  screen,
  fontSize,
  layoutSize,
  setSpText,
}
