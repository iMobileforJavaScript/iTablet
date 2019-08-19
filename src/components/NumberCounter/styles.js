import { StyleSheet, Platform } from 'react-native'
import { scaleSize } from '../../utils'
import { color, size } from '../../styles'

export default StyleSheet.create({
  chooseNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: scaleSize(220),
  },
  imageBtnView: {
    width: scaleSize(40),
    height: scaleSize(40),
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disableImageBtnView: {
    width: scaleSize(40),
    height: scaleSize(40),
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBtn: {
    width: scaleSize(30),
    height: scaleSize(30),
  },
  numberTitle: {
    flex: 1,
    // marginLeft: scaleSize(10),
    minWidth: scaleSize(100),
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: scaleSize(80),
    minWidth: scaleSize(100),
    backgroundColor: 'transparent',
    textAlign: 'center',
    // color: color.themeText2,
    fontSize: size.fontSize.fontSizeMd,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
