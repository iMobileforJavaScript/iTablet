import { StyleSheet } from 'react-native'
import { Const } from '../../constants'
import { scaleSize, setSpText } from '../../utils'
import { size, color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#A0A0A0',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    position: 'absolute',
    width: 80,
    height: 80,
    bottom: 60,
    left: '50%',
    marginLeft: -40,
    // backgroundColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    width: scaleSize(50),
    height: scaleSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  smallIcon: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  toolbar: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#2D2D2F',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonView: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#2D2D2F',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: 0,
  },
  topView: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: scaleSize(100),
    left: 0,
    right: 0,
    bottom: 0,
  },
  lengthChangeView: {
    position: 'absolute',
    flexDirection: 'column',
    height: scaleSize(45),
    minWidth: scaleSize(180),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    top: scaleSize(100),
    left: scaleSize(20),
  },
  titleTotal: {
    height: scaleSize(45),
    // width: scaleSize(240),
    minWidth: scaleSize(180),
    fontSize: setSpText(30),
    backgroundColor: '#rgba(240, 240, 240, 0.5)',
    // backgroundColor: '#FBFBFB',
    // color: '#rgba(70, 128, 223, 1)',
    color: '#FFFFFF',
    // textAlign: 'center',
    paddingLeft: 5,
    textAlign: 'left',
  },
  currentLengthChangeView: {
    position: 'absolute',
    flexDirection: 'row',
    height: scaleSize(45),
    minWidth: scaleSize(200),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    marginLeft: -scaleSize(120),
    left: '50%',
  },
  title: {
    height: scaleSize(45),
    // width: scaleSize(240),
    minWidth: scaleSize(200),
    fontSize: setSpText(30),
    backgroundColor: '#rgba(240, 240, 240, 0.5)',
    // backgroundColor: '#FBFBFB',
    // color: '#rgba(70, 128, 223, 1)',
    color: '#FFFFFF',
    // textAlign: 'center',
    paddingLeft: 5,
    textAlign: 'left',
  },
  SwitchModelsView: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'column',
    // height: '100%',
    // width: '100%',
    // paddingVertical: scaleSize(20),
    // backgroundColor: '#2D2D2F',
    backgroundColor: '#A0A0A0',
    top: scaleSize(100),
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: scaleSize(20),
  },
  titleSwitchModelsView: {
    position: 'absolute',
    height: scaleSize(60),
    // width: scaleSize(240),
    minWidth: scaleSize(180),
    fontSize: setSpText(30),
    backgroundColor: 'transparent',
    // backgroundColor: '#rgba(70, 128, 223, 1)',
    color: 'black',
    textAlign: 'center',
    left: scaleSize(30),
    top: scaleSize(50),
  },
  btnSwitchModelsView: {
    position: 'absolute',
    height: scaleSize(60),
    width: scaleSize(200),
    justifyContent: 'center',
    alignItems: 'center',
    left: scaleSize(30),
    bottom: scaleSize(50),
  },
  txtBtnSwitchModelsView: {
    fontSize: setSpText(30),
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
  },
  DividingLine: {
    position: 'absolute',
    height: scaleSize(20),
    backgroundColor: '#A0A0A0',
    width: '100%',
    bottom: 0,
  },
  ModelItemView: {
    flexDirection: 'column',
    height: scaleSize(300),
    width: '100%',
    // paddingVertical: scaleSize(10),
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    position: 'absolute',
    width: scaleSize(180),
    height: scaleSize(180),
    right: scaleSize(20),
    bottom: scaleSize(50),
  },
  scrollView: {
    position: 'absolute',
    // width: scaleSize(400),
    // height: scaleSize(250),
    left: scaleSize(20),
    right: scaleSize(20),
    top: scaleSize(80),
  },
  scrollViewContentContainer: {
    // paddingVertical: scaleSize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: scaleSize(10),
  },

  // Change Controller
  changeView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    left: '50%',
    right: '50%',
    marginLeft: scaleSize(-100),
    marginTop: scaleSize(-100),
    height: scaleSize(40),
    width: scaleSize(200),
    bottom: 0,
    backgroundColor: 'transparent',
  },
  typeBtn: {
    flex: 1,
    height: scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeTextSelected: {
    fontSize: size.fontSize.fontSizeMd,
    color: 'white',
    backgroundColor: 'transparent',
  },
  typeText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.contentColorGray,
    backgroundColor: 'transparent',
  },

  // Video
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoControlView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  play: {
    // position: 'absolute',
    width: scaleSize(100),
    height: scaleSize(100),
    // bottom: 60,
    // left: '50%',
    // top: '50%',
    // marginLeft: -40,
    // marginTop: -40,
    backgroundColor: 'transparent',
    borderRadius: scaleSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(255, 255, 255, 0.3)',
    borderRadius: scaleSize(50),
  },

  // 进度条
  progressView: {
    position: 'absolute',
    height: 20,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
})
