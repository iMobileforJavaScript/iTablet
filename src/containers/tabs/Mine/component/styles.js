import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

const styles = StyleSheet.create({
  //MineItem
  moreImgBtn: {
    marginRight: 10,
  },
  moreImg: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  btn_image: {
    height: 30,
    width: 30,
  },
  //batchbar
  batchHeadStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchCheckStyle: {
    flexDirection: 'row',
    width: scaleSize(100),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchCheckTextStyle: {
    fontSize: scaleSize(20),
    color: '#505050',
  },
  batchHeadTextStyle: {
    marginRight: scaleSize(30),
    fontSize: scaleSize(20),
  },
})

export default styles
