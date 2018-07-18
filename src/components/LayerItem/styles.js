import { StyleSheet } from 'react-native'
import { size } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: '5',
    height: 60,
  },
  image: {
    marginLeft: 20,
    width: 40,
    height: 40,
  },
  title: {
    marginLeft: 20,
    fontSize: size.fontSize.fontSizeLg,
  },
})