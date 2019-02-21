import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
// import { color, zIndexLevel } from '../../../../styles'
export default StyleSheet.create({
  contain: {
    position: 'absolute',
    top: scaleSize(143),
    left: scaleSize(30),
    width: scaleSize(200),
    height: scaleSize(500),
    // zIndex:zIndexLevel.TWO,
    // backgroundColor:"red",
  },
  PointSearch: {
    width: scaleSize(200),
    height: scaleSize(350),
    // backgroundColor:"red",
  },
  SearchInput: {
    width: scaleSize(200),
    height: scaleSize(80),
    borderWidth: scaleSize(2),
    borderColor: 'red',
    fontSize: scaleSize(24),
  },
  PointSearchList: {
    width: scaleSize(200),
    height: scaleSize(350),
    backgroundColor: 'white',
  },
  itemView: {
    flex: 1,
    height: scaleSize(60),
  },
  itemText: {
    flex: 1,
    fontSize: scaleSize(24),
  },
})
