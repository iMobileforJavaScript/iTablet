import { StyleSheet } from 'react-native'
import { Const } from '../../constants'
import { scaleSize, setSpText } from '../../utils'
import { size, color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  historypoint: {
    flexDirection: 'row',
    width: '100%',
    height: scaleSize(50),
    marginLeft: scaleSize(5),
    marginRight: scaleSize(5),
  },
  historyTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    fontSize: setSpText(30),
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonname: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    fontSize: setSpText(20),
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  historyDataView: {
    position: 'absolute',
    flexDirection: 'row',
    height: scaleSize(520),
    // width: '90%',
    paddingVertical: scaleSize(10),
    // backgroundColor: '#2D2D2F',
    backgroundColor: color.background,
    justifyContent: 'space-between',
    borderRadius: scaleSize(10),
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: scaleSize(120),
  },
  list: {
    position: 'absolute',
    height: scaleSize(450),
    left: scaleSize(5),
    right: scaleSize(5),
    marginTop: scaleSize(10),
    bottom: scaleSize(5),
    backgroundColor: 'transparent',
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
  itemView: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: color.background,
  },
  historyCloseIcon: {
    flex: 1,
  },
  historyDelete: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleSize(60),
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
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: Const.BOTTOM_HEIGHT,
  },
  toolbarb: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.black,
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
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: 0,
  },
  buttonViewb: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.black,
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
    backgroundColor: '#rgba(45, 45, 47, 0.5)',
    // backgroundColor: '#FBFBFB',
    // color: '#rgba(70, 128, 223, 1)',
    color: '#FFFFFF',
    // textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'left',
    borderRadius: scaleSize(5),
  },
  historyItem: {
    flexDirection: 'row',
    height: scaleSize(60),
    width: '70%',
    marginLeft: scaleSize(50),
    marginRight: scaleSize(5),
    fontSize: setSpText(30),
    backgroundColor: color.background,
    color: '#FFFFFF',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: scaleSize(5),
  },
  historyItemText: {
    height: scaleSize(60),
    // width: '100%',
    marginLeft: scaleSize(2),
    marginRight: scaleSize(2),
    fontSize: setSpText(30),
    backgroundColor: color.background,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
    // paddingLeft: 5,
    // paddingRight: 5,
    // textAlign: 'left',
    borderRadius: scaleSize(5),
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
    backgroundColor: '#rgba(45, 45, 47, 0.5)',
    // backgroundColor: '#FBFBFB',
    // color: '#rgba(70, 128, 223, 1)',
    color: '#FFFFFF',
    // textAlign: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'left',
    borderRadius: scaleSize(5),
  },
  SwitchModelsView: {
    position: 'absolute',
    flexDirection: 'column',
    height: scaleSize(400),
    // width: '90%',
    paddingVertical: scaleSize(20),
    // backgroundColor: '#2D2D2F',
    backgroundColor: '#rgba(45, 45, 47, 0.5)',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scaleSize(10),
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: scaleSize(120),
  },
  titleSwitchModelsView: {
    height: scaleSize(60),
    // width: scaleSize(240),
    minWidth: scaleSize(180),
    fontSize: setSpText(30),
    backgroundColor: 'transparent',
    // color: '#rgba(70, 128, 223, 1)',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  btnSwitchModelsView: {
    position: 'absolute',
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    left: scaleSize(20),
    right: scaleSize(20),
    bottom: scaleSize(10),
  },
  txtBtnSwitchModelsView: {
    fontSize: setSpText(30),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  DividingLine: {
    position: 'absolute',
    height: scaleSize(2),
    backgroundColor: 'white',
    left: scaleSize(20),
    right: scaleSize(20),
    top: scaleSize(70),
  },
  ItemSeparatorComponent: {
    height: scaleSize(10),
    backgroundColor: 'transparent',
    marginLeft: scaleSize(5),
    marginRight: scaleSize(5),
  },
  ModelItemView: {
    flexDirection: 'column',
    height: scaleSize(250),
    width: scaleSize(250),
    paddingVertical: scaleSize(10),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    width: scaleSize(180),
    height: scaleSize(180),
  },
  scrollView: {
    position: 'absolute',
    // width: scaleSize(400),
    height: scaleSize(250),
    left: scaleSize(20),
    right: scaleSize(20),
    top: scaleSize(80),
  },
  scrollViewContentContainer: {
    // paddingVertical: 20,
    paddingHorizontal: scaleSize(10),
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
