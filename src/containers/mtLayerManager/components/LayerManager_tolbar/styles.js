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
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: ConstToolType.HEIGHT[3] + BUTTON_HEIGHT,
    minHeight: BUTTON_HEIGHT,
    backgroundColor: '#2D2D2F',
    // zIndex: zIndexLevel.FOUR,
  },
  container: {
    backgroundColor: color.theme,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: color.theme,
    paddingBottom: scaleSize(30),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.themeText,
    // width: scaleSize(160),
  },
  textInputStyle: {
    paddingVertical: 0,
    borderBottomWidth: scaleSize(1),
    borderColor: color.gray3,
    marginTop: scaleSize(30),
    height: scaleSize(50),
    width: '80%',
    color: color.themeText,
    fontSize: size.fontSize.fontSizeXs,
    textAlign: 'center',
  },
})
