import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
const textHeight = 40
export default StyleSheet.create({
  rowView: {
    flex: 1,
    height: 140,
    flexDirection: 'row',
    // height: scaleSize(80),
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 15,
  },
  Img: {
    width: 100,
    height: 100,
    marginLeft: 10,
    // tintColor: color.fontColorBlack,
  },
  title: {
    lineHeight: textHeight,
    textAlign: 'left',
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontWeight: 'bold',
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
  rightBtn: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
})
