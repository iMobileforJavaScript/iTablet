import { StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingVertical: scaleSize(30),
    backgroundColor: color.theme,
  },
  item: {
    flexDirection: 'column',
    // justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.theme,
    // marginHorizontal: scaleSize(30),
    // height: scaleSize(80),
    paddingBottom: scaleSize(30),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.themeText,
    backgroundColor: 'transparent',
    // width: scaleSize(160),
  },
  textInputStyle: {
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderColor: color.gray3,
    marginTop: scaleSize(30),
    height: scaleSize(50),
    width: scaleSize(300),
    color: color.themeText,
    fontSize: size.fontSize.fontSizeXs,
    textAlign: 'center',
  },
  separator: {
    width: '100%',
    height: scaleSize(20),
    backgroundColor: 'transparent',
  },
})
