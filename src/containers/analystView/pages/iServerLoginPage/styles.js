import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerBtnTitle: {
    color: 'white',
    width: scaleSize(100),
    textAlign: 'right',
    fontSize: size.fontSize.fontSizeXXl,
  },
  input: {
    flex: 1,
    width: scaleSize(200),
    height: scaleSize(60),
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: color.UNDERLAYCOLOR,
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeMd,
  },
  loginBtn: {
    height: scaleSize(60),
    width: '50%',
    backgroundColor: color.itemColorBlack,
    marginTop: scaleSize(60),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
