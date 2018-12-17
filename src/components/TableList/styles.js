import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(80,80,80)',
  },
  normalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(80,80,80)',
  },
  row: {
    flex: 1,
    // width: '100%',
    flexDirection: 'row',
    height: scaleSize(80),
    // justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor:"blue"
  },
})
