import { StyleSheet } from 'react-native'
import { scaleSize, screen } from '../../../../utils/index'
import { zIndexLevel } from '../../../../styles/index'
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
    backgroundColor: '#rgba(105, 105, 105, 0.3)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: ConstToolType.HEIGHT[3] + BUTTON_HEIGHT,
    minHeight: BUTTON_HEIGHT,
    backgroundColor: '#F0F0F0',
    // zIndex: zIndexLevel.FOUR,
  },
})
