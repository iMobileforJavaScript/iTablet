import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(60),
    alignItems: 'center',
  },
  children: {
    flex: 1,
    flexDirection: 'column',
  },
})
