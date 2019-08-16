import { Platform, StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    marginHorizontal: scaleSize(60),
    height: scaleSize(44),
    backgroundColor: color.bgW,
    borderRadius: scaleSize(22),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: scaleSize(42),
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: color.contentColorBlack,
    fontSize: size.fontSize.fontSizeMd,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },

  searchView: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginLeft: scaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  clearBtn: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginRight: scaleSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  clearImg: {
    width: scaleSize(23),
    height: scaleSize(23),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  searchImg: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginLeft: scaleSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})
