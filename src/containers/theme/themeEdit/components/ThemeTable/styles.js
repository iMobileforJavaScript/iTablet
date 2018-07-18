import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../../utils'
import { color } from '../../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  head: {
    height: scaleSize(60),
    backgroundColor: color.blue2,
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    height: scaleSize(80),
    flexDirection: 'row',
  },
  selectRow: {
    backgroundColor: color.USUAL_BLUE,
  },
  headerText: {
    color: 'white',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
  selectText: {
    color: 'white',
  },
  dataWrapper: {
    flex: 1,
    marginTop: -1,
  },
  textInput: {
    textAlign: 'center',
  },
})