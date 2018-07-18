import { StyleSheet } from 'react-native'
import { constUtil, scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle:'solid',
    borderTopWidth:0,
    borderLeftWidth:0,
    borderRightWidth:0,
    borderBottomWidth:1,
    borderColor:'#bbbbbb',
  },
  rowOne: {
    height:46,
    width:constUtil.WIDTH,
    padding:3,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  btn_container:{
    height:40,
    // width:46*3,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  btn:{
    height:40,
    width:40,
    marginLeft:3,
    marginRight:3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_image:{
    height: scaleSize(40),
    width: scaleSize(40),
  },
  text_container:{
    height:40,
    width:150,
  },
  rowTwo: {
    height:46,
    width:constUtil.WIDTH,
    backgroundColor:'white',
  },
})