import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../utils'
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
    width: scaleSize(30),
    // flex:1,
    height: scaleSize(30),
  },
  userView: {
    width: scaleSize(60),
    // flex:6,
    height: scaleSize(60),
    borderRadius: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#4C4C4C',
    marginLeft: scaleSize(45),
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
    fontSize: scaleSize(30),
    // fontFamily: 'CenturyGothic',
  },
  moreView: {
    flex: 1,
    marginRight: scaleSize(50),
  },
  moreImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  modulelist: {
    flex: 1,
  },
})
