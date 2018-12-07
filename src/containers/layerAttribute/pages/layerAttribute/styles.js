import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.blackBg,
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
    backgroundColor: color.blackBg,
  },
  info: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.themeText,
    marginTop: scaleSize(100),
  },
  border: {},
})
