import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.modalBgColor,
  },
  topView: {
    flexDirection: 'row',
    height: scaleSize(60),
    width: '100%',
    alignItems: 'center',
  },
  text: {
    marginLeft: scaleSize(25),
    width: scaleSize(280),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    backgroundColor: 'transparent',
  },
  buttons: {
    height: scaleSize(100),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.bgW,
  },
  button: {
    borderRadius: scaleSize(4),
    backgroundColor: color.bgW,
    borderColor: color.content,
    borderWidth: 1,
  },
  buttonTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.content,
    backgroundColor: 'transparent',
  },

  options: {
    flexDirection: 'column',
    paddingHorizontal: scaleSize(30),
    marginTop: scaleSize(20),
  },

  bottomButtons: {
    height: scaleSize(100),
    paddingHorizontal: scaleSize(30),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.bgW,
  },
  bottomBtnTxt: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorGray,
    backgroundColor: 'transparent',
  },
  bottomBtnTxtDisable: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray,
    backgroundColor: 'transparent',
  },
})
