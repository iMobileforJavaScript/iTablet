import { StyleSheet } from 'react-native'
import { scaleSize,screen } from '../../../utils'
import {
  size,
  color,
} from '../../../styles'
export {
  screen,
  color,

}
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    // flex: 1,
    flexDirection: 'row',
    height: scaleSize(300),
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
  headerContent: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: scaleSize(300),
  },
  labelView: {
    flex: 1,
    height: scaleSize(80),
    marginHorizontal: scaleSize(30),
    justifyContent: 'center',
  },
  label: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },
})