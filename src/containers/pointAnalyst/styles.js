import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color } from '../../styles'
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  pointSearchView: {
    backgroundColor: color.contentColorWhite2,
    width: '100%',
    height: scaleSize(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: scaleSize(1),
    borderColor: color.separateColorGray,
  },
  PointSearch: {
    width: scaleSize(600),
    height: scaleSize(60),
    fontSize: scaleSize(24),
    color: color.fontColorGray,
    backgroundColor: 'white',
    borderWidth: scaleSize(2),
    borderColor: '#E0E0E0',
    borderRadius: scaleSize(5),
    // backgroundColor:"red",
  },
  search: {
    width: scaleSize(50),
    height: scaleSize(50),
    marginLeft: scaleSize(20),
  },
  itemSeparator: {
    backgroundColor: color.separateColorGray,
    flex: 1,
    height: 1,
  },
  pointImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    // backgroundColor:"pink",
    marginLeft: scaleSize(20),
  },
  itemText: {
    flex: 1,
    fontSize: scaleSize(24),
    marginLeft: scaleSize(15),
  },
  pointAnalystView: {
    backgroundColor: color.contentColorWhite2,
    width: '100%',
    height: scaleSize(150),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: scaleSize(1),
    borderColor: color.separateColorGray,
    // backgroundColor:"red",
  },
  onInput: {
    width: scaleSize(450),
    height: scaleSize(55),
    fontSize: scaleSize(20),
    padding: (0, 0, 0, scaleSize(15)),
    // textAlign:"center",
    // lineHeight: scaleSize(55),
    color: color.fontColorGray,
    backgroundColor: 'white',
    borderWidth: scaleSize(2),
    borderColor: '#E0E0E0',
    borderRadius: scaleSize(5),
  },
  secondInput: {
    padding: (0, 0, 0, scaleSize(15)),
    width: scaleSize(450),
    height: scaleSize(55),
    fontSize: scaleSize(20),
    // textAlign:"center",
    // lineHeight: scaleSize(55),
    color: color.fontColorGray,
    backgroundColor: 'white',
    borderWidth: scaleSize(2),
    borderColor: '#E0E0E0',
    borderRadius: scaleSize(5),
    marginTop: scaleSize(10),
  },
  startPoint: {
    width: scaleSize(55),
    height: scaleSize(55),
    // backgroundColor:"pink",
    marginRight: scaleSize(20),
  },
  endPoint: {
    width: scaleSize(55),
    height: scaleSize(55),
    // backgroundColor:"pink",
    marginRight: scaleSize(20),
    marginTop: scaleSize(10),
  },
  analyst: {
    width: scaleSize(80),
    height: scaleSize(80),
    marginLeft: scaleSize(20),
  },
  SearchInput: {
    width: scaleSize(350),
    height: scaleSize(50),
    borderWidth: scaleSize(2),
    // borderColor: 'red',
    fontSize: scaleSize(24),
    backgroundColor: 'white',
  },
  PointSearchList: {
    width: scaleSize(200),
    height: scaleSize(350),
    backgroundColor: 'white',
  },
  itemView: {
    flex: 1,
    height: scaleSize(70),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite2,
  },
  wrapper: {
    width: '100%',
    height: scaleSize(440),
    backgroundColor: color.background,
    paddingHorizontal: scaleSize(20),
  },
  searchIconWrap: {
    flex: 1,
    height: scaleSize(140),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    flex: 1,
    height: scaleSize(80),
  },
  iconTxt: {
    fontSize: setSpText(16),
    paddingBottom: scaleSize(20),
  },
  distance: {
    fontSize: setSpText(16),
    paddingRight: scaleSize(20),
  },
})
