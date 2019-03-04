import { Platform, StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    height: scaleSize(44),
    backgroundColor: color.bgW,
    borderRadius: scaleSize(22),
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
  input: {
    flex: 1,
    height: scaleSize(80),
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: color.themeText2,
    fontSize: size.fontSize.fontSizeMd,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },

  clearBtn: {
    width: scaleSize(40),
    height: scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})
