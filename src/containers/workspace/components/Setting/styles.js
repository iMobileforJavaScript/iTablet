import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    // marginTop: Platform.OS === 'ios' ? 64 : 44,
    // alignItems:'center',
    backgroundColor: 'white',
  },
  titleView: {
    height: scaleSize(80),
    justifyContent: 'center',
    paddingHorizontal: scaleSize(30),
    backgroundColor: color.grayLight,
  },
  title: {
    fontSize: setSpText(28),
    color: color.title,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: scaleSize(30),
  },
  content2: {
    flex: 1,
    paddingHorizontal: scaleSize(60),
  },
  row: {
    marginTop: scaleSize(30),
    backgroundColor: 'transparent',
  },
  btns: {
    marginBottom: scaleSize(60),
    marginHorizontal: scaleSize(60),
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  /** ChooseLayer **/
  chooseLayerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
})
