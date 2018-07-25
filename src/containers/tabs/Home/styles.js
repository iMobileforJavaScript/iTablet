import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../utils'
export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  invisibleMap: {
    width: 0,
    height: 0,
  },
  ususalmap:{
    marginTop:scaleSize(40),
  },
})