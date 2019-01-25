import { StyleSheet } from 'react-native'
import { color } from '../../../../../styles'
export const itemWidth = '100%'
export const itemHeight = 140
export const imageWidth = 120
export const imageHeight = 100
export const textHeight = 40
const largeFontSize = 18
const paddingLeft = 15
const styles = StyleSheet.create({
  haveDataViewStyle: {
    flex: 1,
    backgroundColor: color.content_white,
  },
  noDataViewStyle: {
    flex: 1,
    backgroundColor: color.content_white,
  },
  titleTextStyle: {
    width: itemWidth,
    lineHeight: 60,
    fontSize: largeFontSize,
    color: color.font_color_white,
    paddingLeft: paddingLeft,
    textAlign: 'left',
    backgroundColor: color.item_separate_white,
  },
  itemViewStyle: {
    width: itemWidth,
    height: itemHeight,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: color.content_white,
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
