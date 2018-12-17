import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: color.border,
  },
  header: {
    // flex: 1,
    flexDirection: 'column',
    marginTop: scaleSize(30),
  },
  avatarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: scaleSize(160),
    width: scaleSize(160),
  },
  item: {
    // flex: 1,
    // height: scaleSize(80),
    flexDirection: 'row',
    marginHorizontal: scaleSize(30),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scaleSize(1),
    borderBottomColor: color.grayLight,
    paddingVertical: scaleSize(20),
  },
  textView: {
    // height: scaleSize(80),
    justifyContent: 'center',
  },
  title: {
    height: scaleSize(30),
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    color: 'black',
  },
  value: {
    height: scaleSize(30),
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    color: 'gray',
  },
  logoutBtn: {
    marginBottom: scaleSize(30),
    marginHorizontal: scaleSize(30),
    borderRadius: scaleSize(8),
  },
})