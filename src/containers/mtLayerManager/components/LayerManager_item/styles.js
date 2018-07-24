import { StyleSheet } from 'react-native'
import { constUtil, scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    borderStyle:'solid',
    borderTopWidth:0,
    borderLeftWidth:0,
    borderRightWidth:0,
    borderBottomWidth:1,
    borderColor:'#bbbbbb',
  },
  rowOne: {
    // flex: 1,
    height: scaleSize(80),
    padding: scaleSize(6),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  btn_container:{
    // height: scaleSize(80),
    // width:46*3,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  btn:{
    height: scaleSize(60),
    width: scaleSize(60),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_image:{
    height: scaleSize(40),
    width: scaleSize(40),
  },
  text_container:{
    // height:40,
    width: scaleSize(),
  },
  rowTwo: {
    height: scaleSize(90),
    width:constUtil.WIDTH,
    backgroundColor:'white',
  },
  samllImage: {
    width: scaleSize(20),
    height: scaleSize(20),
  },
})