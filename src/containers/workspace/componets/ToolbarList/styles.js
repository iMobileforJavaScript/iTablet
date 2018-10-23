import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(40),
  },
  separatorColumn: {
    marginTop: scaleSize(40),
  },
  separatorRow: {
    marginLeft: scaleSize(40),
  },
})
