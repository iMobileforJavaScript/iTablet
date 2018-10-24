import { Dimensions, Platform } from 'react-native'
import { scaleSize } from '../utils'

const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  onePixel: 1 / 2,
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
}

const fontSize = {
  fontSizeXl: scaleSize(28),
  fontSizeLg: scaleSize(26),
  fontSizeMd: scaleSize(24),
  fontSizeSm: scaleSize(22),
  fontSizeXs: scaleSize(18),
}

const layoutSize = {
  horizonWidth: 15,
  verticalHeight: 15,
}

export default {
  screen,
  fontSize,
  layoutSize,
}
