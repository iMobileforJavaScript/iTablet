import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
// import { color } from '../../styles'
export default StyleSheet.create({
  container: {
    backgroundColor: '#FBFBFB',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    backgroundColor: '#505050',
    paddingLeft: scaleSize(20),
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    backgroundColor: '#FBFBFB',
    paddingLeft: scaleSize(70),
    paddingRight: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom:scaleSize(5),
  },
  selection: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  sectionsTitle: {
    // color: color.themeText,
    color: '#FBFBFB',
    fontSize: setSpText(26),
    marginLeft: scaleSize(25),
  },
  itemName: {
    color: '#303030',
    // color: color.themeText,
    fontSize: setSpText(26),
  },
  itemValue: {
    // color: '#C4C4C4',
    color: '#A0A0A0',
    marginRight: scaleSize(15),
    fontSize: setSpText(22),
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#A0A0A0',
    marginHorizontal: scaleSize(16),
  },
})
