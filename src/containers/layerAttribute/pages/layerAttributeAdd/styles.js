import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white',
    // padding: scaleSize(20),
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: 17,
  },
  btns: {
    height: scaleSize(60),
    // width: '90%',
    // flexDirection: 'row',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // marginHorizontal: scaleSize(150),
    alignItems: 'center',
    marginVertical: scaleSize(100),
  },
  rows: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: scaleSize(60),
    backgroundColor: 'transparent',
  },
  saveAndContinueImage: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  saveAndContinueView2: {
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveAndContinueText: {
    fontSize: setSpText(24),
    textAlign: 'center',
    color: color.blue2,
  },
})
