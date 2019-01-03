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
    height: scaleSize(50),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaleSize(50),
  },
  userImg: {
    width: scaleSize(28),
    // flex:1,
    height: scaleSize(28),
  },
  userView: {
    width: scaleSize(45),
    // flex:6,
    height: scaleSize(45),
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
    fontSize: scaleSize(30),
    // fontFamily: 'CenturyGothic',
  },
  moreImg: {
    // width: scaleSize(10),
    height: scaleSize(30),
  },
  modulelist: {
    flex: 1,
  },
})
