import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  flatList: {
    position: 'absolute',
    alignSelf: 'center',
  },
  module: {
    width: scaleSize(260),
    height: scaleSize(260),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#707070',
    borderRadius: scaleSize(4),
  },

  moduleImage: {
    width: scaleSize(100),
    height: scaleSize(100),
  },
  moduleView: {
    width: scaleSize(300),
    height: scaleSize(300),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    width: scaleSize(130),
    height: scaleSize(32),
    fontSize: setSpText(25),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: scaleSize(13),
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    alignSelf: 'center',
  },
  progressView: {
    position: 'absolute',
    width: scaleSize(260),
    height: scaleSize(260),
    backgroundColor: '#rgba(112, 128, 144,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  progressText: {
    fontSize: setSpText(25),
    fontWeight: 'bold',
    color: 'white',
  },
})
