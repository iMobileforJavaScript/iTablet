import { StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(15),
    borderRadius: scaleSize(30),
  },
  baseStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    minWidth: scaleSize(100),
  },
  blue: {
    backgroundColor: color.blue2,
  },
  gray: {
    backgroundColor: color.gray,
  },
  red: {
    backgroundColor: color.red,
  },
  btnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },

  /** RecordButton **/
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
  },
})
