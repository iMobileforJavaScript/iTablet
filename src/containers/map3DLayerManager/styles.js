import { StyleSheet, Dimensions } from 'react-native'

const width = Dimensions.get('window').width

export default StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
})