import { StyleSheet, Dimensions } from 'react-native'
import { scaleSize } from '../../utils'
import { color } from '../../styles'
const width = Dimensions.get('window').width

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background3,
  },
  btnTabContainer: {
    backgroundColor: 'white',
    width: width,
    paddingVertical: scaleSize(15),
    alignSelf: 'center',
    marginTop: scaleSize(20),
  },
  linlist: {
    paddingVertical: scaleSize(15),
    backgroundColor: 'white',
  },
  examplemaplist: {
    paddingTop: scaleSize(15),
    flex: 1,
    marginTop: scaleSize(20),
    backgroundColor: 'white',
  },
})
