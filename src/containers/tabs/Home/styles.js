import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../utils'
// const SCREEN_WIDTH = Dimensions.get('window').width
export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column',
    backgroundColor: '#2D2D2F',
  },
  header: {
    // width: SCREEN_WIDTH * 0.762,
    flex: 1,
    // backgroundColor:"red",
    height: scaleSize(80),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaleSize(80),
  },
  userImg: {
    width: scaleSize(45),
    // flex:1,
    height: scaleSize(45),
  },
  userView: {
    width: scaleSize(60),
    // flex:6,
    height: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headTitle: {
    flex: 6.5,
    // width: scaleSize(500),
    height: scaleSize(60),
    color: '#FFFFFF',
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontSize: scaleSize(45),
    // fontFamily: 'CenturyGothic',
  },
  moreImg: {
    // width: scaleSize(10),
    height: scaleSize(40),
  },
  modulelist: {
    flex: 1,
  },
})
