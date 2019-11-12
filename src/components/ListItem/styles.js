import { StyleSheet } from 'react-native'
import { size, color } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    // justifyContent: 'center',
    // marginHorizontal: '5',
    height: scaleSize(80),
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: '5',
    height: scaleSize(80) - 1,
  },
  image: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginRight: scaleSize(30),
  },
  title: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    marginLeft: scaleSize(30),
  },
  value: {
    flex: 1,
    marginLeft: scaleSize(20),
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'left',
  },
  separator: {
    flex: 1,
    marginLeft: scaleSize(30),
    marginRight: 0,
    height: 1,
    backgroundColor: color.borderLight,
  },
})
