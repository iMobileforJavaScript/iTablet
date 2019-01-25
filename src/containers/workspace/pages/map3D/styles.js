import { StyleSheet, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
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
    marginLeft: scaleSize(160),
    fontSize: setSpText(18),
    color: 'red',
    width: scaleSize(160),
  },
  textInputStyle: {
    flex: 1,
    fontSize: setSpText(20),
    borderRadius: scaleSize(8),
    borderWidth: scaleSize(1),
    borderColor: '#808080',
    color: '#333333',
  },
})
