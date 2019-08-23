import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { size } from '../../../../styles'

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
  border: {},
})
