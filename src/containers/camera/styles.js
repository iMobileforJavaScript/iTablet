import { StyleSheet } from 'react-native'
import { Const } from '../../constants'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'

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
    // backgroundColor: 'white',
    backgroundColor: 'transparent',
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

  // Change Controller
  changeView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    left: '50%',
    right: '50%',
    marginLeft: scaleSize(-100),
    marginTop: scaleSize(-100),
    height: scaleSize(40),
    width: scaleSize(200),
    bottom: 0,
    backgroundColor: 'transparent',
  },
  typeBtn: {
    flex: 1,
    height: scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeTextSelected: {
    fontSize: size.fontSize.fontSizeMd,
    color: 'white',
    backgroundColor: 'transparent',
  },
  typeText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.contentColorGray,
    backgroundColor: 'transparent',
  },

  // Video
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoControlView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  play: {
    // position: 'absolute',
    width: scaleSize(100),
    height: scaleSize(100),
    // bottom: 60,
    // left: '50%',
    // top: '50%',
    // marginLeft: -40,
    // marginTop: -40,
    backgroundColor: 'transparent',
    borderRadius: scaleSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(255, 255, 255, 0.3)',
    borderRadius: scaleSize(50),
  },

  // 进度条
  progressView: {
    position: 'absolute',
    height: 20,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
})
