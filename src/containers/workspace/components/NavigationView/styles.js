import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import size from '../../../../styles/size'

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
    fontSize: scaleSize(20),
    marginLeft: scaleSize(15),
  },
  pointAnalystView: {
    flex: 1,
    backgroundColor: color.background,
    marginLeft: scaleSize(30),
    marginRight: scaleSize(50),
    height: scaleSize(170),
    borderRadius: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  onInput: {
    flex: 1,
    height: scaleSize(60),
    lineHeight: scaleSize(60),
    justifyContent: 'center',
  },
  secondInput: {
    flex: 1,
    height: scaleSize(60),
    lineHeight: scaleSize(60),
    color: color.fontColorGray,
    justifyContent: 'center',
  },
  analyst: {
    width: scaleSize(80),
    height: scaleSize(80),
    marginLeft: scaleSize(20),
  },
  backbtn: {
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0)',
    marginBottom: scaleSize(40),
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
  btn: {
    paddingHorizontal: scaleSize(5),
    paddingBottom: scaleSize(10),
    marginLeft: scaleSize(15),
    borderRadius: scaleSize(4),
  },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  dialogBackground: {
    height: scaleSize(350),
  },
  promptTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  dialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scaleSize(30),
  },
})
