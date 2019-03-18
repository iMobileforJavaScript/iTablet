import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { color, size } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    height: scaleSize(300),
    width: scaleSize(400),
  },
  title: {
    marginTop: scaleSize(16),
    height: scaleSize(60),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
  },
})
