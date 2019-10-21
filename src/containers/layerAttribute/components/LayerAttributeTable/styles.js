import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

const ROW_HEIGHT = scaleSize(80)
export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: color.subTheme,
    backgroundColor: color.white,
  },
  head: {
    height: scaleSize(60),
    // backgroundColor: color.theme,
    backgroundColor: '#505050',
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
    // color: color.themeText,
    color: '#FBFBFB',
    textAlign: 'center',
  },
  text: {
    // flex:1,
    textAlign: 'center',
    // color: color.themeText,
    color: '#303030',
  },
  selectText: {
    color: color.themeText,
  },
  dataWrapper: {
    flex: 1,
    marginTop: -1,
    backgroundColor: color.content_white,
  },
  textInput: {
    textAlign: 'center',
  },
  border: {
    flex: 1,
    // borderColor: color.borderLight,
    borderColor: '#A0A0A0',
  },
  indexCell: {
    height: ROW_HEIGHT,
    backgroundColor: color.itemColorGray,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCellText: {
    color: color.fontColorWhite,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  cell: {
    height: ROW_HEIGHT,
    backgroundColor: 'transparent',
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  disableCellStyle: {
    height: ROW_HEIGHT,
    // backgroundColor: color.bgW,
    backgroundColor: 'rgba(230, 230, 230, 0.85)',
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: color.themeText2,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})
