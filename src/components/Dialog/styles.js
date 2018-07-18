import { StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  nonModalContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    width: '100%',
    height: '100%',
  },
  dialogStyle: {
    width: '70%',
    borderRadius: scaleSize(16),
    backgroundColor: color.white,
    paddingVertical: scaleSize(30),
  },
  title: {
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: color.title,
    marginVertical: scaleSize(20),
    textAlign: 'center',
  },
  btns: {
    marginTop: scaleSize(60),
    marginHorizontal: scaleSize(60),
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    backgroundColor: color.blue2,
    minWidth: scaleSize(100),
  },
  cancelBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    paddingHorizontal: scaleSize(30),
    borderRadius: scaleSize(30),
    backgroundColor: color.gray,
    minWidth: scaleSize(120),
  },
  btnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})