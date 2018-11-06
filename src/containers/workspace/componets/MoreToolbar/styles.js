import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0.4)',
  },
  table: {
    position: 'absolute',
    flexDirection: 'column',
    padding: scaleSize(10),
    backgroundColor: 'white',
    borderRadius: scaleSize(10),
  },
  row: {
    flexDirection: 'row',
  },
  separator: {
    marginTop: scaleSize(10),
  },
})
