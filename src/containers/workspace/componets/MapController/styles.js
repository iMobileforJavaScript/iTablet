import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: scaleSize(20),
    bottom: scaleSize(120),
    flexDirection: 'column',
    backgroundColor: 'transparent',
    // padding: scaleSize(20),
  },
  topView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: scaleSize(4),
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: scaleSize(4),
  },
  separator: {
    marginTop: scaleSize(20),
  },
  shadow: {
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
})
