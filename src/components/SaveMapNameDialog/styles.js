import { StyleSheet } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(30),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scaleSize(30),
    height: scaleSize(80),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.themeText,
    backgroundColor: 'transparent',
    width: scaleSize(160),
  },
  textInputStyle: {
    flex: 1,
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: color.gray3,
    color: color.themeText,
  },
  separator: {
    width: '100%',
    height: scaleSize(20),
    backgroundColor: 'transparent',
  },
})
