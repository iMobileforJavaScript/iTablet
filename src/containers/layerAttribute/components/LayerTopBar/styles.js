import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    // justifyContent: 'space-around',
    // backgroundColor: color.bgW,
    backgroundColor: color.white,
    width: '100%',
  },
  rightList: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imgBtn: {
    flexDirection: 'row',
    height: scaleSize(80),
    width: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    backgroundColor: color.white,
    height: scaleSize(80),
    width: scaleSize(110),
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: color.bgG,
  },
  btn: {
    backgroundColor: color.white,
    height: scaleSize(80),
    // width: scaleSize(230),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    backgroundColor: 'transparent',
    fontSize: size.fontSize.fontSizeXXl,
    color: color.fontColorGray,
    paddingBottom: scaleSize(4),
  },
  enableBtnTitle: {
    backgroundColor: 'transparent',
    fontSize: size.fontSize.fontSizeXXl,
    color: color.contentColorGray,
    paddingBottom: scaleSize(4),
  },
})
