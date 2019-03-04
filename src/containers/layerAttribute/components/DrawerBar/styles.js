import { StyleSheet, Platform } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size, zIndexLevel } from '../../../../styles'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    width: scaleSize(400),
    flexDirection: 'row',
    backgroundColor: color.bgW,
    zIndex: zIndexLevel.TWO,
  },
  list: {
    flex: 1,
    width: scaleSize(400),
  },
  item: {
    paddingHorizontal: scaleSize(18),
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.bgW,
  },
  selectedItem: {
    paddingHorizontal: scaleSize(18),
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.selected,
  },
  iconBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
    backgroundColor: color.bgW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginLeft: scaleSize(25),
    width: scaleSize(280),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  selectedText: {
    marginLeft: scaleSize(25),
    width: scaleSize(280),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorWhite,
    backgroundColor: 'transparent',
  },
  icon: {
    height: scaleSize(44),
    width: scaleSize(44),
    backgroundColor: 'transparent',
  },
  dotIcon: {
    height: scaleSize(20),
    width: scaleSize(20),
    backgroundColor: 'transparent',
  },
})
