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
    fontSize: size.fontSize.fontSizeXl,
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

  popBtn: {
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: color.bgG,
  },
  popText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  // 图片Item
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
    backgroundColor: 'transparent',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: scaleSize(8),
    backgroundColor: 'transparent',
  },
  deleteOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(255, 255, 255, 0.3)',
    borderRadius: scaleSize(8),
  },
  deleteView: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: scaleSize(40),
    width: scaleSize(40),
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  deleteImg: {
    // flex: 1,
    backgroundColor: 'transparent',
    height: scaleSize(30),
    width: scaleSize(30),
  },
  duration: {
    position: 'absolute',
    bottom: scaleSize(8),
    right: scaleSize(8),
    color: 'white',
    fontSize: 14,
  },
})
