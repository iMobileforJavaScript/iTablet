import { StyleSheet, Platform } from 'react-native'
// import * as Util from '../../../../utils/constUtil'
import { scaleSize, constUtil as Util } from '../../../../utils'
import { color, size, zIndexLevel } from '../../../../styles'
const FUNCTIONHEIGHT = scaleSize(143) + (Platform.OS === 'ios' ? 20 : 0)
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  pop: {
    position: 'absolute',
    left: 0,
    bottom: 0.75 * 1.4 * 0.1 * Util.WIDTH + 5,
    backgroundColor: 'white',
  },
  measureResultContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20,
    backgroundColor: 'transparent',
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  measureResultView: {
    minWidth: scaleSize(120),
    height: scaleSize(80),
    paddingHorizontal: scaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.transView,
  },
  measureResultText: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  mapMenu: {
    width: '100%',
    borderBottomWidth: scaleSize(3),
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingVertical: scaleSize(10),
  },
  mapMenuOverlay: {
    // flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
  cutline: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    height: scaleSize(3),
    marginVertical: scaleSize(10),
  },
  changeLayerBtn: {
    position: 'absolute',
    // flexDirection: 'column',
    // left: 0,
    right: scaleSize(20),
    bottom: scaleSize(200),
    backgroundColor: 'transparent',
  },
  changeLayerImage: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  popView: {
    position: 'absolute',
    flexDirection: 'column',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },

  leftToolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: scaleSize(100),
    width: scaleSize(100),
    backgroundColor: color.theme,
  },
  functionToolbar: {
    position: 'absolute',
    top: FUNCTIONHEIGHT,
    right: scaleSize(0),
    backgroundColor: color.white,
  },
  headerBtnSeparator: {
    marginLeft: scaleSize(40),
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },

  mapController: {
    position: 'absolute',
    left: scaleSize(20),
    bottom: scaleSize(120),
  },
  headerBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  editControllerView: {
    flexDirection: 'row',
    height: scaleSize(100),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressView: {
    position: 'absolute',
    height: 20,
    top: 0,
    left: 0,
    right: 0,
    zIndex: zIndexLevel.FIVE,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
  search: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  iconAr: {
    position: 'absolute',
    right: scaleSize(20),
    padding: scaleSize(5),
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    bottom: scaleSize(135),
    // backgroundColor: 'transparent',
    backgroundColor: color.white,
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: scaleSize(4),
  },
  shadow: {
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  themeoverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    // zIndex: zIndexLevel.FOUR,
  },
  navigation: {
    backgroundColor: 'transparent',
    bottom: scaleSize(150),
    position: 'absolute',
    alignSelf: 'center',
  },
  arnavigation: {
    backgroundColor: 'transparent',
    bottom: scaleSize(300),
    right: scaleSize(31),
    position: 'absolute',
    alignSelf: 'center',
  },
  iconNav: {
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    backgroundColor: color.contentWhite,
  },
  dialogStyle: {
    height: scaleSize(160),
  },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  dialogBackground: {
    height: scaleSize(350),
  },
  dialogOneLine: {
    height: scaleSize(270),
  },
  promptTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  dialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scaleSize(30),
  },
})
