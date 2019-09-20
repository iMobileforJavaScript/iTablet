import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../utils'
import { color } from '../../../styles'
import size from '../../../styles/size'
// const SCREEN_WIDTH = Dimensions.get('window').width
export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column',
    backgroundColor: color.content_white,
  },
  header: {
    // width: SCREEN_WIDTH * 0.762,
    flex: 1,
    // backgroundColor:"red",
    height: scaleSize(50),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaleSize(50),
  },
  userImg: {
    width: scaleSize(60),
    // flex:1,
    height: scaleSize(60),
  },
  userView: {
    width: scaleSize(60),
    // flex:6,
    height: scaleSize(60),
    borderRadius: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#4C4C4C',
    // marginLeft: 20,
    // backgroundColor:"red",
  },
  headTitle: {
    flex: 6.5,
    // width: scaleSize(500),
    height: scaleSize(60),
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontSize: setSpText(30),
    // fontFamily: 'CenturyGothic',
  },
  moreView: {
    flex: 1,
    marginRight: scaleSize(10),
  },
  moreImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  modulelist: {
    flex: 1,
  },
  dialogBackground: {
    height: scaleSize(300),
    backgroundColor: color.content_white,
  },
  dialogHeaderView: {
    flex: 1,
    //  backgroundColor:"pink",
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scaleSize(30),
  },
  // exitChildrenView:{
  //   flex: 1,
  //    backgroundColor:"pink",
  //   flexDirection: 'column',
  //   alignItems: 'center',
  // },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
    // marginLeft:scaleSize(145),
    // marginTop:scaleSize(21),
  },
  promptTtile: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  depict: {
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeLg,
    color: color.theme_white,
    marginTop: scaleSize(2),
  },
  opacityView: {
    height: scaleSize(300),
    backgroundColor: color.content_white,
  },
  btnTitle: {
    fontSize: setSpText(20),
    color: '#303030',
    // borderWidth:1,
    // borderColor:color.bgG,
  },
  checkView: {
    //position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: scaleSize(20),
    //  backgroundColor:"red",
    // marginTop:scaleSize(60),
    // bottom:scaleSize(120),
    //top: scaleSize(140),
    //left: scaleSize(0),
    //paddingLeft: scaleSize(40),
  },
  checkImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  dialogCheck: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.theme_white,
  },
})
