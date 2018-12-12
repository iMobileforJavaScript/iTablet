import { StyleSheet } from 'react-native'
import { constUtil, scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContainer: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#bbbbbb',
    height: scaleSize(80),
  },
  rowOne: {
    // flex: 1,
    height: scaleSize(80),
    padding: scaleSize(6),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:'space-between',
  },
  btn_container: {
    // height: scaleSize(80),
    // width:46*3,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent:'space-between',
  },
  btn: {
    height: scaleSize(50),
    width: scaleSize(100),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_image: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  btn_image_samll: {
    height: scaleSize(30),
    width: scaleSize(30),
  },
  btnImage: {
    // height: scaleSize(40),
    width: scaleSize(40),
  },
  btnImageView: {
    height: scaleSize(80),
    width: scaleSize(100),
    // paddingHorizontal: scaleSize(10),
    backgroundColor: color.blue2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_container: {
    // height:40,
    // width: scaleSize(),
    marginLeft: scaleSize(30),
  },
  text: {
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
  },
  rowTwo: {
    height: scaleSize(90),
    width: constUtil.WIDTH,
    backgroundColor: 'white',
  },
  samllImage: {
    width: scaleSize(20),
    height: scaleSize(20),
  },
  additionView: {
    flexDirection: 'column',
    width: '100%',
    paddingLeft: scaleSize(72),
  },
  radioView: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: scaleSize(2),
    borderColor: color.USUAL_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelected: {
    height: scaleSize(20),
    width: scaleSize(20),
    borderRadius: scaleSize(10),
    backgroundColor: color.USUAL_BLUE,
  },
  radioViewGray: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: scaleSize(2),
    borderColor: color.gray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelectedGray: {
    height: scaleSize(20),
    width: scaleSize(20),
    borderRadius: scaleSize(10),
    backgroundColor: color.gray,
  },
})
