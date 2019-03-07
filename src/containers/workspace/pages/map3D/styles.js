import { StyleSheet, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color, size } from '../../../../styles'
const FUNCTIONHEIGHT = scaleSize(143) + (Platform.OS === 'ios' ? 20 : 0)
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
    right: scaleSize(31),
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
  search: {
    width: scaleSize(30),
    height: scaleSize(30),
  },
})
