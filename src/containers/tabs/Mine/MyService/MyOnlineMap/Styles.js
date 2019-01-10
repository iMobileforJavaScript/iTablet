import { StyleSheet } from 'react-native'
import { color } from '../../../../../styles'
export const itemWidth = '100%'
export const itemHeight = 140
export const imageWidth = 120
export const imageHeight = 100
export const textHeight = 40
const largeFontSize = 20
const styles = StyleSheet.create({
  haveDataViewStyle: {
    flex: 1,
    backgroundColor: color.theme,
  },
  noDataViewStyle: {
    flex: 1,
    backgroundColor: color.content,
  },
  titleTextStyle: {
    width: itemWidth,
    lineHeight: 60,
    fontSize: largeFontSize,
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
    backgroundColor: color.content,
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: '#c0c0c0',
  },
  restTitleTextStyle: {
    width: itemWidth,
    fontSize: largeFontSize,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
    textAlign: 'left',
  },
  separateViewStyle: {
    width: itemWidth,
    height: 8,
    backgroundColor: color.theme,
  },
})
export default styles
