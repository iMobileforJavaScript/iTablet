import { StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.contentColorWhite,
  },
  subContainer: {
    flex: 1,
    marginTop: scaleSize(45),
    backgroundColor: color.contentColorWhite,
  },
  headerBtnTitle: {
    color: 'white',
    width: scaleSize(100),
    textAlign: 'right',
    fontSize: size.fontSize.fontSizeXXl,
  },
  input: {},
})
