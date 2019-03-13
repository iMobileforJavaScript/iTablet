import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { color } from '../../styles'

export default StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: color.content_white,
  },
  normalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: color.content_white,
  },
  row: {
    flex: 1,
    // width: '100%',
    flexDirection: 'row',
    height: scaleSize(120),
    // justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor:"blue"
  },
})
