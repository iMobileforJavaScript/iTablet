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
    flexDirection: 'column',
    width: scaleSize(450),
    backgroundColor: color.content_white,
    borderRadius: 12,
    // backgroundColor: 'transparent',
    // paddingVertical: scaleSize(10),
  },
  opacityView: {
    position: 'absolute',
    width: scaleSize(450),
    borderRadius: 12,
  },
  title: {
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    marginVertical: scaleSize(20),
    textAlign: 'center',
    color: color.themeText2,
  },
  info: {
    // marginTop: scaleSize(20),
    fontSize: size.fontSize.fontSizeXl,
    backgroundColor: 'transparent',
    marginVertical: scaleSize(20),
    marginHorizontal: scaleSize(20),
    textAlign: 'center',
    color: color.themeText2,
  },
  childrenContainer: {
    flex: 1,
    // marginBottom: scaleSize(80),
  },
  btns: {
    // position: 'absolute',
    width: '100%',
    // left: 0,
    // bottom: 0,
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  oneBtn: {
    // position: 'absolute',
    height: scaleSize(80),
    width: '100%',
    // left: 0,
    // bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  confirmBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    //height: scaleSize(60),
    // paddingHorizontal: scaleSize(30),
    backgroundColor: color.content_white,
    //width: scaleSize(110),
  },
  cancelBtnStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //height: scaleSize(60),
    // paddingHorizontal: scaleSize(10),
    backgroundColor: color.content_white,
    //width: scaleSize(110),
  },
  btnStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  separateLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#EEEEEE',
  },
  btnTitle: {
    flex: 1,
    height: scaleSize(80),
    lineHeight: scaleSize(80),
    color: color.themeText2,
    fontSize: size.fontSize.fontSizeXXl,
    backgroundColor: 'transparent',
    // backgroundColor:"red",
    textAlign: 'center',
  },
  btnDisableTitle: {
    flex: 1,
    height: scaleSize(80),
    lineHeight: scaleSize(80),
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXXl,
    backgroundColor: 'transparent',
    // backgroundColor:"red",
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
    paddingHorizontal: scaleSize(30),
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

  contentView: {
    flex: 1,
    flexDirection: 'column',
  },
  errorView: {
    marginTop: Platform.OS === 'ios' ? scaleSize(4) : 0,
    width: '100%',
    minHeight: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: scaleSize(30),
  },
  errorInfo: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.red,
    textAlign: 'left',
  },
})
