import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRightWidth: 1,
    borderColor: color.borderColor,
  },
  list: {
    flex: 1,
    width: scaleSize(400),
  },
  item: {
    flex: 1,
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSelected: {
    flex: 1,
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.selected,
  },
  text: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
})
