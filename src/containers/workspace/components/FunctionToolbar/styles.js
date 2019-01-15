import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: scaleSize(71.5),
    right: scaleSize(15.5),
    backgroundColor: 'white',
    borderRadius: scaleSize(2),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  separator: {
    marginTop: scaleSize(10),
  },
  btn: {
    paddingHorizontal: scaleSize(5),
    paddingBottom: scaleSize(10),
  },
})
