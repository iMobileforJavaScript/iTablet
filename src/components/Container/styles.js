import { StyleSheet } from 'react-native'
import { color, zIndexLevel } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(40),
    backgroundColor: color.USUAL_BLUE,
  },
  iOSPadding: {
    flex: 1,
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
    top: 0,
    left: 0,
    right: 0,
    zIndex: zIndexLevel.FOUR,
  },
  fixBottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(80),
    backgroundColor: color.theme,
    alignSelf: 'center',
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexBottomBar: {
    height: scaleSize(80),
    width: '100%',
    alignSelf: 'center',
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
