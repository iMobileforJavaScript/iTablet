import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    backgroundColor: color.content_white,
  },
  scrollView: {
    // flex: 1,
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },
  headerBtnTitleDisable: {
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXXl,
  },

  topView: {
    flexDirection: 'column',
  },

  subTitleView: {
    flexDirection: 'row',
    height: scaleSize(60),
    marginTop: scaleSize(8),
    marginHorizontal: scaleSize(30),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  btnsView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})
