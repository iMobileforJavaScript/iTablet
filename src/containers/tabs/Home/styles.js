import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../utils'
import { color } from '../../../styles'
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
    width: scaleSize(350),
    height: scaleSize(240),
    borderRadius: scaleSize(4),
    backgroundColor: 'transparent',
  },
  dialogHeaderView: {
    flex: 1,
    //  backgroundColor:"pink",
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    opacity: 0.85,
    // marginLeft:scaleSize(145),
    // marginTop:scaleSize(21),
  },
  promptTtile: {
    fontSize: setSpText(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
  },
  opacityView: {
    width: scaleSize(350),
    height: scaleSize(240),
    borderRadius: scaleSize(4),
    backgroundColor: color.content_white,
  },
  btnTitle: {
    fontSize: setSpText(20),
    color: '#303030',
    // borderWidth:scaleSize(1),
    // borderColor:color.bgG,
  },
  checkView: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    // justifyContent:"center",
    alignItems: 'center',
    //  backgroundColor:"red",
    // marginTop:scaleSize(60),
    // bottom:scaleSize(120),
    top: scaleSize(110),
    left: scaleSize(0),
    paddingLeft: scaleSize(40),
  },
  checkImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  dialogCheck: {
    fontSize: setSpText(18),
    color: color.theme_white,
  },
})
