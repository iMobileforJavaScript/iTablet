import { StyleSheet } from 'react-native'
import { size, color } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },

  /** Check按钮 **/
  selectImgView: {
    width: scaleSize(80),
    height: scaleSize(160),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    backgroundColor: 'transparent',
  },

  /** 顶部视图 **/
  topView: {
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.bgW,
  },
  topLeftView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    paddingLeft: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
  },
  topRightView: {
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.bgW,
  },
  topText: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  /** 底部视图 **/
  bottomView: {
    flexDirection: 'row',
    height: scaleSize(100),
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: color.bgW,
    backgroundColor: 'red',
    borderTopWidth: 1,
    borderColor: color.border,
  },
  bottomView2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: color.bgW,
    backgroundColor: 'yellow',
  },
  bottomLeftView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(100),
    paddingLeft: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
  },
  bottomRightView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(100),
    paddingRight: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: color.bgW,
  },
  bottomBtnView: {
    height: scaleSize(80),
    width: scaleSize(160),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomBtnIcon: {
    width: scaleSize(80),
    height: scaleSize(80),
    backgroundColor: 'transparent',
  },
  cutButton: {
    height: scaleSize(80),
    width: scaleSize(180),
    borderRadius: scaleSize(4),
    borderWidth: 1,
    borderColor: color.fontColorBlack,
    backgroundColor: color.white,
  },
  cutTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    width: scaleSize(200),
    height: scaleSize(60),
    // marginLeft: scaleSize(30),
    paddingVertical: 0,
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: color.UNDERLAYCOLOR,
    textAlign: 'center',
  },
})
