import { StyleSheet } from 'react-native'
import * as Util from '../../../../utils/constUtil'

export default StyleSheet.create({
  container: {
    height:0.14*Util.WIDTH,
    width: '100%',
    flexDirection:'row',
    backgroundColor:'white',
    borderStyle:'solid',
    borderTopWidth:0,
    borderLeftWidth:0,
    borderRightWidth:0,
    borderBottomWidth:1,
    borderColor:'#bbbbbb',
    justifyContent:'space-around',
    alignItems: 'center',
  },
})