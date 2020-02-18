/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'

export default StyleSheet.create({
  box: {
    position: 'absolute',
    width: '100%',
    elevation: 100,
  },
  overlayer: {
    flex: 1,
    backgroundColor: color.modalBgColor,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(200),
    padding: scaleSize(20),
    backgroundColor: color.contentWhite,
  },
  // closeBox: {
  //   position: 'absolute',
  //   right: 0,
  //   top: 0,
  //   width: scaleSize(40),
  //   height: scaleSize(40),
  //   zIndex: 100,
  // },
  // closeBtn: {
  //   width: scaleSize(40),
  //   height: scaleSize(40),
  // },
  title: {
    fontSize: setSpText(24),
  },
  info: {
    paddingTop: scaleSize(20),
    fontSize: setSpText(20),
    color: color.gray,
  },
  search: {
    marginTop: scaleSize(20),
    height: scaleSize(60),
    flex: 1,
    borderRadius: 5,
    backgroundColor: color.blue1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTxt: {
    fontSize: setSpText(20),
    color: color.white,
  },
  searchIconWrap: {
    flex: 1,
    height: scaleSize(100),
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
  },
  itemView: {
    flex: 1,
    height: scaleSize(90),
    flexDirection: 'column',
    alignItems: 'center',
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
    marginTop: scaleSize(20),
    marginLeft: scaleSize(15),
  },
  distance: {
    marginTop: scaleSize(20),
    fontSize: setSpText(16),
    paddingRight: scaleSize(20),
  },
  searchBox: {
    marginTop: scaleSize(20),
    height: scaleSize(60),
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navi: {
    height: scaleSize(60),
    flex: 1,
    borderRadius: 5,
    backgroundColor: color.blue1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  address: {
    marginLeft: scaleSize(15),
    height: scaleSize(30),
    fontSize: setSpText(16),
    color: color.gray,
    alignSelf: 'flex-start',
  },
  moreWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: setSpText(20),
  },
})
