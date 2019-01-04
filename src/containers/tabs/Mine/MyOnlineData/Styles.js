import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
export const itemWidth = Dimensions.get('window').width
export const itemHeight = 140
export const imageWidth = 120
export const imageHeight = 100
export const textHeight = 40
const smallFontSize = 16
const largeFontSize = 18
const styles = StyleSheet.create({
  haveDataViewStyle: {
    flex: 1,
    backgroundColor: color.blackBg,
  },
  noDataViewStyle: {
    flex: 1,
    backgroundColor: color.content,
  },
  titleTextStyle: {
    width: itemWidth,
    lineHeight: textHeight,
    fontSize: smallFontSize,
    color: '#c0c0c0',
    paddingLeft: 10,
    textAlign: 'left',
    backgroundColor: color.theme,
  },
  itemViewStyle: {
    width: itemWidth,
    height: itemHeight,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: '#c0c0c0',
  },
  restTitleTextStyle: {
    flex: 1,
    width: itemWidth - 30 - imageWidth,
    fontSize: largeFontSize,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  separateViewStyle: {
    width: itemWidth,
    height: 8,
    backgroundColor: color.theme,
  },
})
export default styles
export { color }
