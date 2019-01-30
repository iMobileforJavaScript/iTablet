import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
// const SCREEN_WIDTH = Dimensions.get('window').width
export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#rgba(240, 240, 240, 1)',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: scaleSize(70),
    //    backgroundColor:"pink",
  },
  iTablet: {
    width: scaleSize(128),
    height: scaleSize(128),
  },
  headerTitle: {
    height: scaleSize(50),
    marginTop: scaleSize(25),
    color: color.fontColorBlack,
    fontSize: setSpText(36),
  },
  version: {
    marginTop: scaleSize(5),
    color: color.fontColorBlack,
    fontSize: setSpText(22),
  },
  contentView: {
    flexDirection: 'column',
    // alignItems:"center",
    width: scaleSize(720),
    // paddingLeft:scaleSize(50),
    // paddingRight:scaleSize(50),
    marginTop: scaleSize(57),
  },
  support: {
    height: scaleSize(80),
    // backgroundColor:"pink",
    flexDirection: 'row',
    alignItems: 'center',
  },
  consult: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportTitle: {
    position: 'absolute',
    left: scaleSize(30),
    color: color.fontColorBlack,
    fontSize: setSpText(26),
  },
  consultTitle: {
    position: 'absolute',
    left: scaleSize(30),
    color: color.fontColorBlack,
    fontSize: setSpText(26),
  },
  phone: {
    position: 'absolute',
    right: scaleSize(30),
    color: color.fontColorGray,
    fontSize: setSpText(22),
  },
  separator: {
    backgroundColor: color.fontColorBlack,
    height: scaleSize(1),
  },
  footerView: {
    // marginTop: scaleSize(270),
    height: scaleSize(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"pink",
    position: 'absolute',
    left: scaleSize(290),
    bottom: scaleSize(145),
  },
  separatorView: {
    width: scaleSize(51),
    height: scaleSize(40),
    flexDirection: 'column',
    alignItems: 'center',
  },
  cloumSeparator: {
    width: scaleSize(1),
    height: scaleSize(40),
    backgroundColor: color.fontColorGray,
    //  marginLeft:scaleSize(25),
    //  marginRight:scaleSize(25),
  },
  offcial: {
    // flex:1,
    height: scaleSize(40),
    // flexDirection:"row",
    // justifyContent:"flex-end",
    marginRight: scaleSize(25),
    // width: scaleSize(90),
    // height: scaleSize(30),
    //  alignItems:"center",
    //  textAlign:"center",
    // backgroundColor:"red",
  },
  protocol: {
    // flex:1,
    height: scaleSize(40),
    // backgroundColor:"blue",
    // flexDirection:"row",
    // justifyContent:"flex-start",
    marginLeft: scaleSize(25),
  },
  footerItem: {
    color: color.switch,
    fontSize: setSpText(22),
  },
  informationView: {
    position: 'absolute',
    bottom: scaleSize(92),
  },
  information: {
    width: scaleSize(385),
    textAlign: 'center',
    color: color.fontColorGray,
    fontSize: setSpText(16),
  },
})
