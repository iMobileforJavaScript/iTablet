import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'

export default StyleSheet.create({
  container: {
    backgroundColor: color.background,
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: 17,
  },
  subContainer: {
    flexDirection: 'row',
    height: scaleSize(100),
    paddingHorizontal: scaleSize(40),
    alignItems: 'center',
    backgroundColor: color.background,
  },
  title: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    marginLeft: scaleSize(30),
    height: scaleSize(60),
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
  },
})