import { StyleSheet, Dimensions } from 'react-native'
import { scaleSize } from '../../../utils'
const SCREEN_WIDTH = Dimensions.get('window').width
export default StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'column',
    backgroundColor: '#2D2D2F',
  },
  header: {
    width: SCREEN_WIDTH * 0.762,
    height: scaleSize(80),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleSize(80),
  },
  userimg: {
    width: scaleSize(45),
    height: scaleSize(45),
  },
  userview: {
    width: scaleSize(65),
    height: scaleSize(65),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headtitle: {
    width: scaleSize(500),
    height: scaleSize(60),
    color: '#FFFFFF',
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontSize: scaleSize(45),
    // fontFamily: 'CenturyGothic',
  },
  elseimg: {
    width: scaleSize(10),
    height: scaleSize(40),
  },
})
