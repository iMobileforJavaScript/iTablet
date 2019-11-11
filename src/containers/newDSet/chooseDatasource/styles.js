import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../utils'
import { size } from '../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 10,
  },
  row: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleSize(30),
  },
  rowTitle: {
    fontSize: size.fontSize.fontSizeMd,
    marginLeft: scaleSize(30),
  },
  imageView: {
    height: scaleSize(40),
    width: scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  imageSmall: {
    height: scaleSize(20),
    width: scaleSize(20),
  },
})
