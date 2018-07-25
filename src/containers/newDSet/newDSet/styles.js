import { StyleSheet } from 'react-native'
import { constUtil, scaleSize } from '../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop:10,
  },
  input: {
    width: 0.75 * constUtil.WIDTH,
    marginTop: scaleSize(60),
    marginHorizontal: scaleSize(100),
    height: scaleSize(80),
    borderStyle: 'solid',
    borderColor: constUtil.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
    borderRadius: scaleSize(10),
    backgroundColor: 'white',
    paddingHorizontal: scaleSize(10),
  },
})