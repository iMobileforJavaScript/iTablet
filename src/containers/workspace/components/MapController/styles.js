import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: scaleSize(17),
    bottom: scaleSize(102.5),
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
  compass: {
    borderRadius: scaleSize(4),
  },
  separator: {
    marginTop: scaleSize(20),
  },
  compassView: {
    width: scaleSize(50),
    height: scaleSize(50),
    borderRadius: scaleSize(4),
    marginBottom: 20,
  },
  shadow: {
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
})
