import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
export const itemHeight = scaleSize(200)
export const imageWidth = scaleSize(240)
export const imageHeight = scaleSize(160)
export default StyleSheet.create({
  itemBtn: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: color.content_white,
    borderBottomWidth: 1,
    borderColor: color.item_separate_white,
  },
  leftView: {
    flex: 1,
    height: itemHeight,
    // backgroundColor:"red",
    // padding:scaleSize(20),
    paddingTop: scaleSize(20),
    paddingLeft: scaleSize(30),
    paddingBottom: scaleSize(20),
  },
  itemTitle: {
    flex: 1,
    // padding:scaleSize(10),
    // height:scaleSize(40),
    // backgroundColor:"pink",
    fontSize: scaleSize(28),
  },
  // itemInformation:{
  //     color:"#888",
  //     padding:scaleSize(10),
  //     height:scaleSize(80),
  //     backgroundColor:"blue"
  // },
  itemTime: {
    // padding:scaleSize(10),
    // height:scaleSize(50),
    // flex:1,
    height: scaleSize(40),
    color: '#888',
    // marginTop:scaleSize(10),
    fontSize: scaleSize(21),
  },
  rightView: {
    height: itemHeight,
    width: scaleSize(300),
    // backgroundColor:"pink",
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: imageWidth,
    height: imageHeight,
    //   backgroundColor:"blue"
  },
  // itemSeparator:{
  //     height:1,
  //     backgroundColor:color.item_separate_white
  // }
})
