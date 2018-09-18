import { StyleSheet ,Dimensions} from 'react-native'
import { scaleSize } from '../../../utils'
import { color, size } from '../../../styles'
const SCREEN_WIDTH = Dimensions.get('window').width
export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  invisibleMap: {
    width: 0,
    height: 0,
  },
  ususalmap:{
    // marginTop:scaleSize(20),
  },
  btnbarhome:{
    width:SCREEN_WIDTH,
    height:scaleSize(12),
    backgroundColor:"#f3f3f3",
    borderBottomWidth:scaleSize(1),
    borderColor:"#E8E8E8",
    borderTopWidth:scaleSize(1),
  },
  mapbtnview:{
    width:SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    borderColor:"#E8E8E8",
    borderTopWidth:scaleSize(2),
  },
  mapbtn:{
    width:SCREEN_WIDTH *0.5-scaleSize(1),
    height:scaleSize(60),
    // backgroundColor:"blue",
    alignItems:'center',
    justifyContent: 'center',
    borderBottomWidth:scaleSize(1),
    borderColor:"#E8E8E8",
  },
  mapbtnselected:{
    width:SCREEN_WIDTH *0.5-scaleSize(1),
    height:scaleSize(60),
    // backgroundColor:"blue",
    alignItems:'center',
    justifyContent: 'center',
    borderBottomWidth:scaleSize(6),
    borderColor:"#4BA0FF",
  },
  cutline:{
    width:scaleSize(2),
    height:scaleSize(40),
    backgroundColor:"#E8E8E8",
  },
  mapselect:{
    fontSize:scaleSize(30),
    color:"#1296db",
  },
  mapunselect:{
    fontSize:scaleSize(30),
  },
  selectlist:{
    width:SCREEN_WIDTH,
    // height:scaleSize(50),
    // backgroundColor:"blue",
  },
  examplemaplist:{
    fontSize: size.fontSize.fontSizeXl,
    color: color.content,
  },
})