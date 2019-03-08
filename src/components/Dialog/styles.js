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
    width: scaleSize(350),
    borderRadius: scaleSize(4),
    backgroundColor: color.content_white,
    // backgroundColor: 'transparent',
    paddingVertical: scaleSize(10),
  },
  opacityView: {
    position: 'absolute',
    width: scaleSize(350),
    borderRadius: scaleSize(4),
  },
  title: {
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    marginVertical: scaleSize(20),
    textAlign: 'center',
    color: color.themeText2,
  },
  info: {
    marginTop: scaleSize(20),
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    marginVertical: scaleSize(20),
    textAlign: 'center',
    color: color.themeText2,
  },
  btns: {
    marginTop: scaleSize(30),
    marginHorizontal: scaleSize(40),
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oneBtn: {
    marginTop: scaleSize(30),
    marginHorizontal: scaleSize(40),
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(40),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(4),
    backgroundColor: color.content_white,
    borderWidth: 1,
    width: scaleSize(110),
  },
  cancelBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(39),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(4),
    backgroundColor: color.content_white,
    borderWidth: 1,
    width: scaleSize(110),
  },
  btnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(39),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(4),
    backgroundColor: color.content_white,
    borderWidth: 1,
    borderColor: color.bgG,
    width: scaleSize(110),
  },
  btnTitle: {
    color: color.themeText2,
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
    color: color.themeText2,
    // width: scaleSize(160),
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    marginLeft: scaleSize(10),
    height: scaleSize(60),
    borderColor: color.grayLight2,
    borderWidth: 1,
    borderRadius: scaleSize(4),
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: color.themeText2,
    fontSize: size.fontSize.fontSizeMd,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
