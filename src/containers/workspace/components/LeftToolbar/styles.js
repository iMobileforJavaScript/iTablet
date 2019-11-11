import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: scaleSize(20),
  },
  separator: {
    marginTop: scaleSize(20),
  },
})
