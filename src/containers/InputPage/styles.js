import { StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.separateColorGray,
  },
  subContainer: {
    flex: 1,
    marginTop: scaleSize(45),
    backgroundColor: color.separateColorGray,
  },
  headerBtnTitle: {
    color: 'white',
    // width: scaleSize(150),
    // textAlign: 'right',
    fontSize: size.fontSize.fontSizeXXl,
  },
  headerBtnTitleDisable: {
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXXl,
  },
  input: {},
  errorView: {
    height: scaleSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scaleSize(30),
  },
  errorInfo: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.red,
    textAlign: 'left',
  },
})
