import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils/index'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // height: scaleSize(430),
    flexDirection: 'column',
    backgroundColor: 'white',
    zIndex: 101,
  },
  drawerBtn: {
    top: 0,
    width: '100%',
    height: scaleSize(40),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerBtnImage: {
    width: scaleSize(40),
    height: scaleSize(10),
  },
  showBtnStyle: {
    position: 'absolute',
    left: scaleSize(20),
    bottom: scaleSize(30),
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: 'gray',
    zIndex: 101,
  },
  showBtnImage: {
    height: scaleSize(30),
    width: scaleSize(30),
    alignSelf: 'center',
    // borderRadius: 5,
  },
})
