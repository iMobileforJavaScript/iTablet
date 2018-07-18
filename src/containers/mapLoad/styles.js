import { StyleSheet, Dimensions } from 'react-native'

const width = Dimensions.get('window').width

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  btnTabContainer: {
    backgroundColor: 'white',
    height: 80,
    width: width,
    padding: 5,
    alignSelf: 'center',
  },
  offLine: {
    width: width,
    height: 500,
    backgroundColor: 'white',
  },
})