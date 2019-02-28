import { StyleSheet, Platform } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: scaleSize(30),
    backgroundColor: 'white',
    borderRadius: scaleSize(4),
    height: scaleSize(80),
    paddingHorizontal: scaleSize(20),
  },
  label: {
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(32),
    color: color.themeText2,
    // width: scaleSize(160),
    textAlign: 'center',
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

  clearImg: {
    width: scaleSize(23),
    height: scaleSize(23),
  },
})
