import { StyleSheet } from 'react-native'
import { constUtil, scaleSize } from '../../utils'
import { size } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 10,
  },
  input: {
    width: 0.75 * constUtil.WIDTH,
    marginTop: scaleSize(30),
    marginHorizontal: scaleSize(100),
    height: scaleSize(80),
    borderStyle: 'solid',
    borderColor: constUtil.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
    borderRadius: scaleSize(10),
    backgroundColor: 'white',
    paddingHorizontal: scaleSize(10),
  },
  textContainer: {
    marginTop: scaleSize(30),
    height: scaleSize(40),
    width: 0.75 * constUtil.WIDTH,
  },
  text: {
    fontSize: size.fontSize.fontSizeMd,
  },
  btn: {
    marginTop: scaleSize(60),
  },
})
