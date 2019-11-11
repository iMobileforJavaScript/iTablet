import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../../utils/index'
import { size } from '../../../../../styles/index'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: constUtil.USUAL_GREEN,
    // paddingTop:10,
    paddingHorizontal: scaleSize(30),
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    paddingVertical: scaleSize(15),
    paddingHorizontal: scaleSize(30),
    backgroundColor: 'white',
  },
  rowTitle: {
    fontSize: size.fontSize.fontSizeLg,
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
