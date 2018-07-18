import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { size } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    height: scaleSize(100),
    width: '100%',
    justifyContent:'center',
    paddingHorizontal: scaleSize(30),
  },
  itemText: {
    fontSize: size.fontSize.fontSizeMd,
  },
})