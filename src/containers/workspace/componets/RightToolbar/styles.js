import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: scaleSize(20),
    right: scaleSize(20),
    backgroundColor: 'white',
    padding: scaleSize(20),
  },
  separator: {
    marginTop: scaleSize(20),
  },
})
