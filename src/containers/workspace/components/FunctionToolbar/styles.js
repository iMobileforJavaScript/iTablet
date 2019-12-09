import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 95,
    right: scaleSize(25),
    backgroundColor: color.content_white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  separator: {
    marginTop: scaleSize(10),
  },
  btnView: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: scaleSize(5),
    paddingBottom: scaleSize(10),
  },
  progress: {
    width: scaleSize(60),
    // width: scaleSize(18),
    height: 2,
    // position: 'absolute',
    // right: scaleSize(0),
    // left: scaleSize(0),
    // top: scaleSize(4),
    bottom: scaleSize(4),
    borderWidth: 0,
  },
})
