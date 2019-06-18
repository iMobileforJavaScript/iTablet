import { StyleSheet } from 'react-native'
import { size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },
  plusBtnView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(80),
  },
  plusImgView: {
    height: scaleSize(80),
    width: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusImg: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  btnTitleStyle: {
    fontSize: size.fontSize.fontSizeLg,
  },
})
