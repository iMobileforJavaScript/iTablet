import { StyleSheet } from 'react-native'
import { scaleSize, screen } from '../../../../utils/index'
import { zIndexLevel, color, size } from '../../../../styles/index'
import { ConstToolType } from '../../../../constants/index'
// 地图按钮栏默认高度
const BUTTON_HEIGHT = scaleSize(80)

export default StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    height: screen.deviceHeight,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    maxHeight: ConstToolType.HEIGHT[3] + BUTTON_HEIGHT,
    minHeight: BUTTON_HEIGHT,
    backgroundColor: color.content_white,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.content_white,
    paddingBottom: scaleSize(30),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.themeText2,
    // width: scaleSize(160),
  },
  textInputStyle: {
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderColor: color.themeText2,
    marginTop: scaleSize(30),
    height: scaleSize(50),
    width: '80%',
    color: color.themeText2,
    fontSize: size.fontSize.fontSizeXs,
    textAlign: 'center',
  },
})
