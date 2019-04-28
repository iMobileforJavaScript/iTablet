import { StyleSheet, Platform } from 'react-native'
import { size, color } from '../../styles'
import { scaleSize } from '../../utils'

const ROW_HEIGHT = scaleSize(80)

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },

  /** Check按钮 **/
  select: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectImgView: {
    width: ROW_HEIGHT,
    height: ROW_HEIGHT,
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
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.bgW,
  },
  topLeftView: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    paddingLeft: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  topRightView: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    // paddingRight: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  topRightView2: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    // paddingRight: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  topText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  /** 底部视图 **/
  bottomView: {
    // flex: 1,
    // height: '100%',
    height: scaleSize(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.bgW,
    borderTopWidth: 1,
    borderColor: color.border,
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
    height: ROW_HEIGHT,
    width: scaleSize(160),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomBtnIcon: {
    width: ROW_HEIGHT,
    height: ROW_HEIGHT,
    backgroundColor: 'transparent',
  },
  cutButton: {
    height: ROW_HEIGHT,
    width: scaleSize(180),
    borderRadius: scaleSize(4),
    borderWidth: 1,
    borderColor: color.fontColorBlack,
    backgroundColor: color.white,
  },
  cutButtonDisable: {
    height: ROW_HEIGHT,
    width: scaleSize(180),
    borderRadius: scaleSize(4),
    borderWidth: 1,
    borderColor: color.fontColorGray,
    backgroundColor: color.white,
  },
  cutTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  cutTitleDisable: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray,
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
    fontSize: size.fontSize.fontSizeMd,
  },

  /** 列表item **/
  content: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  downImg: {
    marginLeft: scaleSize(4),
    width: scaleSize(30),
    height: scaleSize(30),
  },

  /** 选择数据源弹窗 **/
  popView: {
    backgroundColor: color.bgW,
  },
  dsList: {
    maxHeight: (scaleSize(ROW_HEIGHT) + 1) * 6, // 最多6条
    backgroundColor: 'transparent',
  },
  dsItem: {
    flex: 1,
    flexDirection: 'row',
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scaleSize(30),
  },
  dsItemIcon: {
    width: scaleSize(30),
    height: scaleSize(30),
    tintColor: color.fontColorBlack,
  },
  dsItemText: {
    marginLeft: scaleSize(10),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  closeDSBtn: {
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: color.bgG,
  },
  closeText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  dsItemInput: {
    flex: 1,
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(60),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    borderBottomWidth: 1,
    borderBottomColor: color.fontColorBlack,
  },

  /** 设置 **/
  settingTopView: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    marginLeft: scaleSize(30),
    alignItems: 'center',
  },
  settingTopTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    backgroundColor: 'transparent',
  },
  settingContentView: {
    flexDirection: 'column',
    backgroundColor: color.bgW,
  },
  settingBtnView: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: color.bgG,
  },
  settingBtn: {
    height: ROW_HEIGHT,
    width: scaleSize(160),
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    // height: scaleSize(20),
    // width: scaleSize(120),
  },

  /** 选择数据源page **/
  dsListView: {
    flex: 1,
    backgroundColor: color.bgW,
  },
})
