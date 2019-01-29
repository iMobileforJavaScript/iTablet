import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: color.contentColorWhite,
  },
  header: {
    flexDirection: 'column',
    // marginTop: 30,
  },
  item2: {
    backgroundColor: color.contentColorWhite,
    width: '100%',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
