import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { size, color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#FBFBFB',
    width: '100%',
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: 17,
  },
  btns: {
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(150),
    alignItems: 'center',
    marginVertical: scaleSize(30),
    backgroundColor: '#rgba(255, 255, 255, 0.5)',
  },
  infoView: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: color.subTheme,
    backgroundColor: '#FBFBFB',
    width: '100%',
  },
  info: {
    fontSize: size.fontSize.fontSizeLg,
    // color: color.themeText,
    color: '#303030',
    marginTop: scaleSize(100),
  },
  headerBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  editControllerView: {
    flexDirection: 'row',
    height: scaleSize(100),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.bgW,
  },
})
