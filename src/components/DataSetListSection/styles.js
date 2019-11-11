import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: scaleSize(80),
    paddingHorizontal: scaleSize(16),
    paddingVertical: scaleSize(8),
  },
  imageView: {
    height: scaleSize(60),
    width: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: scaleSize(40),
    width: scaleSize(40),
    marginLeft: scaleSize(20),
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
  },
})
