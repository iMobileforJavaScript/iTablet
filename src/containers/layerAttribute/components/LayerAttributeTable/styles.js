import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.blackBg,
  },
  head: {
    height: scaleSize(60),
    backgroundColor: color.theme,
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: color.themeText,
  },
  row: {
    height: scaleSize(80),
    flexDirection: 'row',
  },
  selectRow: {
    backgroundColor: color.USUAL_BLUE,
  },
  headerText: {
    color: color.themeText,
    textAlign: 'center',
  },
  text: {
    // flex:1,
    textAlign: 'center',
    color: color.themeText,
  },
  selectText: {
    color: color.themeText,
  },
  dataWrapper: {
    flex: 1,
    marginTop: -1,
  },
  textInput: {
    textAlign: 'center',
  },
  border: {
    flex: 1,
    borderColor: color.borderLight,
  },
})
