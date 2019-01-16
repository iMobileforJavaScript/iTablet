import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
export default StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
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
    backgroundColor: '#F0F0F0',
    paddingLeft: scaleSize(70),
    paddingRight: scaleSize(80),
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  selection: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginLeft: scaleSize(51),
  },
  sectionsTitle: {
    color: '#F0F0F0',
    fontSize: scaleSize(26),
    marginLeft: scaleSize(25),
  },
  itemName: {
    color: '#303030',
    fontSize: scaleSize(26),
    marginLeft: scaleSize(15),
  },
  itemValue: {
    color: '#A0A0A0',
    marginRight: scaleSize(15),
    fontSize: scaleSize(22),
  },
  itemSeparator: {
    width: scaleSize(688),
    height: scaleSize(1),
    backgroundColor: '#A0A0A0',
    marginLeft: scaleSize(16),
  },
  selectImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    // backgroundColor: 'pink',
  },
  visibleImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    // backgroundColor: 'blue',
    marginLeft: scaleSize(15),
  },
  type: {
    width: scaleSize(60),
    height: scaleSize(60),
    // backgroundColor: '#A0A0A0',
    marginLeft: scaleSize(15),
  },
  moreView: {
    width: scaleSize(60),
    height: scaleSize(60),
    // backgroundColor: 'red',
    position: 'absolute',
    right: scaleSize(30),
  },
  moreImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
})
