import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
export const itemWidth = Dimensions.get('window').width
export const itemHeight = Dimensions.get('window').height
export const imageWidth = 140
export const textHeight = 40

const styles = StyleSheet.create({
  itemBottomContainerStyle: {
    backgroundColor: color.theme,
    width: itemWidth,
    height: 2,
  },
  itemTopContainer: {
    flexDirection: 'row',
    width: itemWidth,
    height: imageWidth,
  },
  itemTopInternalImageStyle: {
    width: imageWidth,
    height: imageWidth,
    backgroundColor: '#52514C',
  },

  itemTopInternalRightContainerStyle: {
    width: itemWidth - imageWidth,
    height: imageWidth,
    backgroundColor: color.border,
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  itemTopInternalRightBottomViewStyle: {
    height: textHeight * 2,
    width: itemWidth - imageWidth - 5,
  },
  itemTopInternalRightTextStyle: {
    lineHeight: textHeight,
    width: itemWidth - imageWidth,
    fontSize: 16,
    color: 'white',
  },
  itemTopInternalItemContainerStyle: {
    height: textHeight,
    width: itemWidth - imageWidth,
  },
  itemTopInternalRightBottomBottomViewStyle: {
    flexDirection: 'row',
    height: textHeight,
    width: itemWidth - imageWidth,
  },
  textStyle: {
    textAlign: 'left',
    lineHeight: textHeight,
    fontSize: 16,
    color: 'white',
  },
  fontLargeStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
})
export default styles
