import { StyleSheet } from 'react-native'
import { constUtil, scaleSize, setSpText } from '../../../utils/index'
// import { size } from '../../../styles/index'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: constUtil.USUAL_GREEN,
    paddingTop: 10,
  },
  content: {
    flex: 1,
  },
  subContent: {
    backgroundColor: 'white',
  },
  titleView: {
    height: scaleSize(80),
    width: '100%',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: setSpText(24),
  },
  row: {
    paddingVertical: scaleSize(15),
    paddingHorizontal: scaleSize(30),
    backgroundColor: 'white',
  },
  rowTitle: {
    // fontSize: size.fontSize.fontSizeLg,
    fontSize: setSpText(24),
  },
  rowMarginTop: {
    marginTop: scaleSize(30),
  },
  btns: {
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(150),
    alignItems: 'center',
    marginVertical: scaleSize(30),
    backgroundColor: 'transparent',
  },
})
