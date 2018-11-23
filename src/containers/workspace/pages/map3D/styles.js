import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
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
    top: scaleSize(100),
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
    fontSize: scaleSize(20),
    color: 'black',
    width: scaleSize(160),
  },
  placeholder:{
    marginLeft:scaleSize(160),
    fontSize: scaleSize(18),
    color: 'red',
    width: scaleSize(160),
  },
  textInputStyle: {
    flex: 1,
    borderRadius: scaleSize(8),
    borderWidth: scaleSize(1),
    borderColor: 'white',
  },
})
