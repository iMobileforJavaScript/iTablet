import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXXl,
  },
  headerView: {
    height: scaleSize(81),
    borderBottomWidth: scaleSize(1),
    borderBottomColor: color.borderLight,
  },
  methodItem: {
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleSize(20),
  },
  headerItem: {
    height: scaleSize(40),
    width: scaleSize(100),
    borderRadius: scaleSize(20),
    borderWidth: scaleSize(1),
    borderColor: color.content,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerItemText: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    margin: 0,
  },
  headerSelectedItem: {
    height: scaleSize(40),
    width: scaleSize(100),
    borderRadius: scaleSize(20),
    borderWidth: scaleSize(1),
    borderColor: color.switch,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSelectedItemText: {
    color: color.switch,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    margin: 0,
  },
  headerSeparator: {
    height: scaleSize(40),
    width: scaleSize(30),
  },
  contentView: {
    flex: 1,
  },
  contentTop: {
    height: scaleSize(350),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTitle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.content,
  },
  method: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.bgG,
  },
  contentValue: {
    marginTop: scaleSize(20),
    fontSize: size.fontSize.fontSizeXXXl,
    color: color.content,
  },
  contentBottom: {
    marginHorizontal: scaleSize(30),
  },
  contentBottomTextRow: {
    flexDirection: 'row',
    height: scaleSize(80),
  },
  contentBottomTextTitleView: {
    height: scaleSize(40),
    width: scaleSize(200),
    alignItems: 'flex-start',
  },
  contentBottomTextValueView: {
    flex: 1,
    height: scaleSize(40),
    alignItems: 'flex-start',
  },
  contentBottomText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.bgG,
  },
})
