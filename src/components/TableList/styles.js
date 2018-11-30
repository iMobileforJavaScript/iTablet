import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  normalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
  },
})
