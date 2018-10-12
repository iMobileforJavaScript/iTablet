import { StyleSheet } from 'react-native'
import * as Util from '../../utils/constUtil'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  pop: {
    position: 'absolute',
    left: 0,
    bottom: 0.75 * 1.4 * 0.1 * Util.WIDTH + 5,
    backgroundColor: Util.USUAL_GREEN,
  },
  measure: {
    position: 'absolute',
    left: 0.25 * Util.WIDTH,
    top: 5,
    borderRadius: 5,
    backgroundColor: Util.USUAL_GREEN,
    borderStyle: 'solid',
    borderColor: Util.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
  },
})