import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color, size } from '../../styles'
export default StyleSheet.create({
  container: {
    backgroundColor: '#FBFBFB',
  },
  section: {
    flex: 1,
    height: scaleSize(80),
    backgroundColor: color.bgW,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    paddingLeft: scaleSize(14),
    height: scaleSize(80),
    padding: scaleSize(6),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  selectionImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginLeft: scaleSize(20),
  },
  sectionsTitle: {
    marginLeft: scaleSize(25),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: size.fontSize.fontSizeXXl,
    color: color.content,
  },
  itemName: {
    fontSize: setSpText(24),
    // marginLeft: scaleSize(30),
    // marginRight:scaleSize(30),
  },
  itemValue: {
    color: '#A0A0A0',
    marginRight: scaleSize(15),
    fontSize: setSpText(22),
  },
  itemSeparator: {
    // width: scaleSize(688),
    flex: 1,
    height: 1,
    backgroundColor: '#A0A0A0',
    // marginLeft: scaleSize(16),
  },
  selectImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    // backgroundColor: 'pink',
  },
  btn: {
    height: scaleSize(50),
    width: scaleSize(60),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibleImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    // backgroundColor: 'blue',
    // marginLeft: scaleSize(10),
  },
  type: {
    width: scaleSize(40),
    height: scaleSize(40),
    // backgroundColor: '#A0A0A0',
    marginLeft: scaleSize(25),
  },
  moreView: {
    height: scaleSize(50),
    width: scaleSize(60),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  itemBtn: {
    flex: 1,
    // backgroundColor:"#4680DF",
  },
  sectionFooter: {
    flexDirection: 'column',
    width: '100%',
    height: scaleSize(10),
    backgroundColor: color.separateColorGray,
  },
})
