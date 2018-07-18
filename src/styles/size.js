import { Dimensions, Platform } from 'react-native'
import { scaleSize } from '../utils'

const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  onePixel: 1 / 2,
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
}

const fontSize = {
  fontSizeXl: scaleSize(30),
  fontSizeLg: scaleSize(28),
  fontSizeMd: scaleSize(26),
  fontSizeSm: scaleSize(24),
  fontSizeXs: scaleSize(20),
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
