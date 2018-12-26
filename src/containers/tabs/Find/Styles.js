import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../styles'
export const itemWidth = Dimensions.get('window').width
export const itemHeight = 140
export const imageWidth = 120
export const imageHeight = 120
export const textHeight = 40
const smallFontSize = 12
const largeFontSize = 18
const styles = StyleSheet.create({
  haveDataViewStyle: {
    flex: 1,
    backgroundColor: color.blackBg,
  },
  noDataViewStyle: {
    flex: 1,
    backgroundColor: color.blackBg,
  },

  itemViewStyle: {
    width: itemWidth,
    height: itemHeight,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
  },
  restTitleTextStyle: {
    width: itemWidth - 30 - imageWidth,
    fontSize: largeFontSize,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
    textAlign: 'left',
    flexWrap: 'wrap',
  },

  viewStyle2: {
    width: itemWidth - 30 - imageWidth,
    height: 20,
    flexDirection: 'row',
    paddingLeft: 10,
    marginTop: 10,
  },
  imageStyle2: {
    width: 20,
    height: 20,
  },
  textStyle2: {
    textAlign: 'left',
    color: 'white',
    lineHeight: 20,
    fontSize: smallFontSize,
    paddingLeft: 5,
  },
  downloadStyle: {
    width: 200,
    height: 40,
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  downloadTextStyle: {
    width: 80,
    lineHeight: 30,
    textAlign: 'center',
    position: 'absolute',
    bottom: 10,
    color: 'white',
  },
  separateViewStyle: {
    width: itemWidth,
    height: 8,
    backgroundColor: color.theme,
  },
})
export default styles
