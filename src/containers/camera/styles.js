import { StyleSheet } from 'react-native'
import { Const } from '../../constants'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    position: 'absolute',
    width: 80,
    height: 80,
    bottom: 60,
    left: '50%',
    marginLeft: -40,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  smallIcon: {
    width: 40,
    height: 40,
  },
  buttonView: {
    position: 'absolute',
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 0,
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  play: {
    position: 'absolute',
    width: 80,
    height: 80,
    bottom: 60,
    left: '50%',
    top: '50%',
    marginLeft: -40,
    marginTop: -40,
    backgroundColor: 'yellow',
    borderRadius: 40,
  },
})
