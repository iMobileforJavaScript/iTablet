import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
export const screenWidth = Dimensions.get('window').width
export const screenHeight = Dimensions.get('window').height
export const imageWidth = 140
export const textHeight = 40

const styles = StyleSheet.create({
  itemBottomContainerStyle: {
    backgroundColor: color.theme,
    width: screenWidth,
    height: 2,
  },
  itemTopContainer: {
    flexDirection: 'row',
    width: screenWidth,
    height: imageWidth,
  },
  itemTopInternalImageStyle: {
    width: imageWidth,
    height: imageWidth,
    backgroundColor: '#52514C',
  },

  itemTopInternalRightContainerStyle: {
    width: screenWidth - imageWidth,
    height: imageWidth,
    backgroundColor: color.border,
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  itemTopInternalRightBottomViewStyle: {
    height: textHeight * 2,
    width: screenWidth - imageWidth - 5,
  },
  itemTopInternalRightTextStyle: {
    lineHeight: textHeight,
    width: screenWidth - imageWidth,
    fontSize: 16,
    color: 'white',
  },
  itemTopInternalItemContainerStyle: {
    height: textHeight,
    width: screenWidth - imageWidth,
  },
  itemTopInternalRightBottomBottomViewStyle: {
    flexDirection: 'row',
    height: textHeight,
    width: screenWidth - imageWidth,
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
