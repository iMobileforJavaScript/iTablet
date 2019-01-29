import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
export const itemWidth = '100%'
export const itemHeight = 140
export const imageWidth = 100
export const imageHeight = 100
export const textHeight = 40
const smallFontSize = 16
const largeFontSize = 20
const paddingLeft = 15
const styles = StyleSheet.create({
  haveDataViewStyle: {
    flex: 1,
    backgroundColor: color.contentColorWhite,
  },
  noDataViewStyle: {
    flex: 1,
    backgroundColor: color.contentColorWhite,
  },
  titleTextStyle: {
    width: itemWidth,
    lineHeight: textHeight,
    fontSize: smallFontSize,
    color: color.font_color_white,
    paddingLeft: paddingLeft,
    textAlign: 'left',
    backgroundColor: color.contentColorWhite,
  },
  itemViewStyle: {
    width: itemWidth,
    height: itemHeight,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: color.image_bg_white,
  },
  restTitleTextStyle: {
    width: itemWidth,
    fontSize: largeFontSize,
    fontWeight: 'bold',
    color: color.font_color_white,
    paddingLeft: paddingLeft,
    textAlign: 'left',
  },
  separateViewStyle: {
    width: itemWidth,
    height: 1,
    backgroundColor: color.item_separate_white,
  },
})
export default styles
export { color }
