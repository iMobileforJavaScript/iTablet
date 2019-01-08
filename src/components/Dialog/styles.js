import { StyleSheet, Platform } from 'react-native'
import { color, size, zIndexLevel } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  nonModalContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: '100%',
    zIndex: zIndexLevel.FOUR,
  },
  dialogStyle: {
    width: '70%',
    borderRadius: scaleSize(16),
    backgroundColor: color.white,
    paddingVertical: scaleSize(30),
  },
  title: {
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    marginVertical: scaleSize(20),
    textAlign: 'center',
    color: color.themeText,
  },
  info: {
    marginTop: scaleSize(20),
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    marginVertical: scaleSize(20),
    textAlign: 'center',
    color: color.themeText,
  },
  btns: {
    marginTop: scaleSize(30),
    marginHorizontal: scaleSize(60),
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    backgroundColor: color.gray,
    minWidth: scaleSize(120),
  },
  cancelBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    backgroundColor: color.gray,
    minWidth: scaleSize(120),
  },
  btnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },

  // InputDialog
  inputDialogContainer: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: scaleSize(30),
    paddingVertical: scaleSize(30),
    paddingHorizontal: scaleSize(60),
    // backgroundColor: 'yellow',
  },
  label: {
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(32),
    color: color.themeText,
    // width: scaleSize(160),
    textAlign: 'center',
    backgroundColor: color.subTheme,
  },
  input: {
    flex: 1,
    marginLeft: scaleSize(10),
    height: scaleSize(60),
    borderColor: color.grayLight2,
    borderWidth: scaleSize(1),
    borderRadius: scaleSize(4),
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: color.themeText,
    fontSize: size.fontSize.fontSizeMd,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
