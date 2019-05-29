import { StyleSheet } from 'react-native'
import { size, color } from '../../styles'
import { scaleSize } from '../../utils'

const IMAGE_SIZE = scaleSize(150)

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },
  plusImageView: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: color.borderLight,
    backgroundColor: 'transparent',
  },
  imageView: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: scaleSize(8),
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: scaleSize(8),
  },
  tableView: {
    padding: scaleSize(30),
  },
  tableCellView: {
    // flex: 1,
    height: IMAGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRowStyle: {
    height: IMAGE_SIZE,
  },
})
