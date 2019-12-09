import { Platform, StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
const FUNCTIONHEIGHT = scaleSize(143) + (Platform.OS === 'ios' ? 20 : 0)
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'stretch',
  },
  functionToolbar: {
    position: 'absolute',
    top: FUNCTIONHEIGHT,
    right: scaleSize(20),
    backgroundColor: color.white,
  },
})
