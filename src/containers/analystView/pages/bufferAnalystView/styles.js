import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    backgroundColor: color.content_white,
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },
  headerBtnTitleDisable: {
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXXl,
  },
  tabView: {
    height: scaleSize(80),
  },

  topView: {
    flexDirection: 'column',
  },
  checkView: {
    flexDirection: 'row',
    height: scaleSize(60),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: scaleSize(30),
  },
  checkTips: {
    marginLeft: scaleSize(10),
    fontSize: size.fontSize.fontSizeSm,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  subTitleView: {
    flexDirection: 'row',
    height: scaleSize(60),
    marginTop: scaleSize(8),
    marginHorizontal: scaleSize(30),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  btnsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(50),
    height: scaleSize(80),
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})
