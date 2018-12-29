import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles/index'
import { scaleSize } from '../../../../utils/index'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(30),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.title,
    // width: scaleSize(160),
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})
