import { StyleSheet ,Dimensions} from 'react-native'
import * as Util from '../../utils/constUtil'
import { scaleSize } from '../../utils'
const SCREEN_WIDTH = Dimensions.get('window').width
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
    backgroundColor: 'white',
  },
  measure: {
    position: 'absolute',
    left: 0.35 * Util.WIDTH,
    top: 5,
    // left: 0,
    // bottom: 0.75 * 1.4 * 0.1 * Util.WIDTH + 5,
    borderRadius: 5,
    backgroundColor: 'white',
    // zIndex:10,
    borderStyle: 'solid',
    borderColor: Util.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
  },
  mapMenu:{
    width:SCREEN_WIDTH,
    position: 'absolute',
    zIndex:1,
    borderBottomWidth:scaleSize(3),
    borderColor:"#E8E8E8",
    // left:0,
    // bottom: 0.75 * 1.4 * 0.1 * Util.WIDTH + 5,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  cutline:{
    width:SCREEN_WIDTH,
    backgroundColor:"#E8E8E8",
    height:scaleSize(3),
  },
  changeLayerBtn: {
    position: 'absolute',
    // flexDirection: 'column',
    // left: 0,
    right: 0,
    bottom: scaleSize(200),
    backgroundColor: 'transparent',
  },
  changeLayerImage: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
})