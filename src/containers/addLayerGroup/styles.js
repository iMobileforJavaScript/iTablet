import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'

export default StyleSheet.create({
  container: {
    backgroundColor: color.white,
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
    backgroundColor: color.white,
  },
  title: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    marginLeft: scaleSize(30),
    paddingVertical: 0,
    height: scaleSize(60),
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: color.UNDERLAYCOLOR,
  },
})
