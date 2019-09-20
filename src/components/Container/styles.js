import { StyleSheet } from 'react-native'
import { color, zIndexLevel } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#rgba(240, 240, 240 ,0)',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(40),
    backgroundColor: color.USUAL_BLUE,
  },
  iOSPadding: {
    // flex: 1,
    flexDirection: 'row',
    height: scaleSize(20),
    backgroundColor: color.theme,
  },
  headerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixHeader: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    zIndex: zIndexLevel.THREE,
  },
  fixBottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(96),
    backgroundColor: color.theme,
    alignSelf: 'center',
    zIndex: zIndexLevel.TWO,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexBottomBar: {
    height: scaleSize(96),
    width: '100%',
    alignSelf: 'center',
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
