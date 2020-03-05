import { StyleSheet, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color, size, zIndexLevel } from '../../../../styles'
const FUNCTIONHEIGHT = scaleSize(143) + (Platform.OS === 'ios' ? 20 : 0)
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 500,
    width: '100%',
    // flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },
  imageBtnsView: {
    position: 'absolute',
    bottom: 60,
    right: 10,
    flexDirection: 'row',
  },
  mapController: {
    position: 'absolute',
    left: scaleSize(20),
    bottom: scaleSize(120),
  },
  functionToolbar: {
    position: 'absolute',
    top: FUNCTIONHEIGHT,
    right: scaleSize(20),
    backgroundColor: color.white,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scaleSize(30),
    height: scaleSize(80),
  },
  title: {
    fontSize: setSpText(22),
    color: '#333333',
    width: scaleSize(160),
  },
  placeholder: {
    marginTop: scaleSize(15),
    marginLeft: scaleSize(30),
    fontSize: setSpText(18),
    color: 'red',
    // width: scaleSize(160),
  },
  textInputStyle: {
    marginTop: scaleSize(25),
    height: scaleSize(70),
    flex: 1,
    fontSize: setSpText(20),
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: '#808080',
    color: '#333333',
  },
  measureResultContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: scaleSize(80),
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
  search: {
    width: scaleSize(40),
    height: scaleSize(40),
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
})
