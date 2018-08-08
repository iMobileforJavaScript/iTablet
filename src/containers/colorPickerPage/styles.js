import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  colorPicker: {
    width: '60%',
    height: scaleSize(400),
    alignSelf: 'center',
  },
  rows: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
  },
  row: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignContent: 'center',
  },
})