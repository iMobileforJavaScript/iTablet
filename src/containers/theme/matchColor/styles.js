import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../utils/index'
import { size } from '../../../styles/index'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 10,
  },
  row: {
    paddingVertical: scaleSize(15),
    paddingHorizontal: scaleSize(30),
    backgroundColor: 'white',
  },
  rowTitle: {
    fontSize: size.fontSize.fontSizeLg,
  },
})
