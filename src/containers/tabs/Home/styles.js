import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column',
    backgroundColor: 'white',
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
})