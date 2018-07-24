import { StyleSheet } from 'react-native'
import { size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: '5',
    height: scaleSize(80),
  },
  imageView: {
    marginLeft: scaleSize(30),
    width: scaleSize(60),
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  samllImage: {
    width: scaleSize(20),
    height: scaleSize(20),
  },
  title: {
    marginLeft: scaleSize(20),
    fontSize: size.fontSize.fontSizeLg,
  },
})