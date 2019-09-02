import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

const styles = StyleSheet.create({
  rowView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  Img: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginLeft: 20,
    tintColor: color.fontColorBlack,
  },
  title: {
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontSize: size.fontSize.fontSizeXl,
    flex: 1,
  },
  selectImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginLeft: 20,
  },
  moreImgBtn: {
    marginRight: 10,
  },
  moreImg: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  //check
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
