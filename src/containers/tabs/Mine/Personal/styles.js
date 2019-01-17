import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: color.content_white,
  },
  header: {
    flexDirection: 'column',
    // marginTop: 30,
  },
  item2: {
    backgroundColor: color.content_white,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
