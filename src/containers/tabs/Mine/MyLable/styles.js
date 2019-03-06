import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
export default StyleSheet.create({
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
  moreImgBtn: {
    marginRight: 10,
  },
  moreImg: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
})
