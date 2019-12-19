import { StyleSheet } from 'react-native'
import { Const } from '../../constants'
import { scaleSize, setSpText } from '../../utils'
import { color, size } from '../../styles'

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
    color: 'white',
    fontSize: setSpText(36),
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
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listaction: {
    position: 'absolute',
    flexDirection: 'row',
    height: scaleSize(50),
    left: scaleSize(5),
    right: scaleSize(5),
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  historyCloseIcon: {
    position: 'absolute',
    left: scaleSize(100),
    right: scaleSize(100),
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historySelect: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleSize(10),
    backgroundColor: 'transparent',
  },
  historyDelete: {
    marginRight: scaleSize(3),
    height: scaleSize(50),
    width: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallIcon: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  smallIcons: {
    marginLeft: scaleSize(10),
    width: scaleSize(30),
    height: scaleSize(30),
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
    height: scaleSize(80),
    width: '70%',
    marginLeft: scaleSize(10),
    marginRight: scaleSize(5),
    fontSize: setSpText(30),
    backgroundColor: 'white',
    color: '#FFFFFF',
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
  },
  historyItemText: {
    height: scaleSize(60),
    // width: '100%',
    marginLeft: scaleSize(2),
    marginRight: scaleSize(2),
    fontSize: setSpText(30),
    backgroundColor: 'white',
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
    // paddingLeft: 5,
    // paddingRight: 5,
    // textAlign: 'left',
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
  btn_image: {
    position: 'absolute',
    left: scaleSize(10),
    width: scaleSize(100),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btn_image2: {
    position: 'absolute',
    right: scaleSize(10),
    width: scaleSize(100),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backbtn: {
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0)',
  },
  separator: {
    // flex: 1,
    marginHorizontal: 0,
    height: 1,
    backgroundColor: color.separateColorGray,
  },
  item: {
    backgroundColor: color.contentColorWhite,
    height: scaleSize(80),
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  btnTitle: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: size.fontSize.fontSizeXl,
    color: color.contentColorBlack,
  },
  bottomStyle: {
    position: 'absolute',
    bottom: 0,
    height: scaleSize(80),
    paddingHorizontal: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#A0A0A0',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  bottomItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
