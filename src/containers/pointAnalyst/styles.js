import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  PointSearch: {
    width: scaleSize(200),
    height: scaleSize(350),
    // backgroundColor:"red",
  },
  analystInput: {
    width: scaleSize(350),
    height: scaleSize(60),
    borderWidth: scaleSize(2),
    // borderColor: 'red',
    fontSize: scaleSize(24),
    backgroundColor: 'white',
  },
  SearchInput: {
    width: scaleSize(350),
    height: scaleSize(60),
    borderWidth: scaleSize(2),
    // borderColor: 'red',
    fontSize: scaleSize(24),
    backgroundColor: 'white',
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
