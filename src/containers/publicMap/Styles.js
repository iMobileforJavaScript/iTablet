import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../styles'
export const itemWidth = Dimensions.get('window').width
export const itemHeight = 140
export const imageWidth = 90
export const imageHeight = 90
export const textHeight = 40
const smallFontSize = 12
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

  itemViewStyle: {
    width: '100%',
    height: itemHeight,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: color.image_bg_white,
  },
  restTitleTextStyle: {
    width: '100%',
    fontSize: largeFontSize,
    fontWeight: 'bold',
    // color: 'white',
    paddingLeft: paddingLeft,
    textAlign: 'left',
    flexWrap: 'wrap',
    marginRight: 100,
  },

  viewStyle2: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    paddingLeft: paddingLeft,
    marginTop: 10,
    marginRight: 100,
  },
  imageStyle2: {
    width: 20,
    height: 20,
  },
  textStyle2: {
    textAlign: 'left',
    // color: 'white',
    lineHeight: 20,
    fontSize: smallFontSize,
    paddingLeft: 5,
  },
  separateViewStyle: {
    width: '100%',
    height: 2,
  },
})
export default styles
