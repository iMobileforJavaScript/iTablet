import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height
let width = screenWidth < screenHeight ? screenWidth : screenHeight
let height = screenWidth < screenHeight ? screenWidth : screenHeight
const itemWidth = width * 0.8
const itemHeight = 40
const fontSize = 16
const titleOnFocusBackgroundColor = color.blackBg
const titleOnBlurBackgroundColor = color.border
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // justifyContent:"space-around",
    alignItems: 'center',
    backgroundColor: color.border,
  },
  keyboardAvoidingStyle: {
    padding: 9,
    alignItems: 'center',
    width: width,
    height: height,
  },
  titleStyle: {
    marginTop: 20,
    flexDirection: 'row',
    width: itemWidth,
    height: itemHeight,
    marginBottom: 20,
  },
  titleContainerStyle: {
    flex: 1,
    fontSize: fontSize,
    lineHeight: itemHeight,
    color: 'white',
    textAlign: 'center',
  },
  textInputStyle: {
    width: itemWidth,
    height: itemHeight,
    fontSize: fontSize,
    borderBottomColor: color.borderLight,
    color: '#c0c0c0',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  loginStyle: {
    height: itemHeight,
    width: itemWidth * 0.6,
    backgroundColor: color.blackBg,
    marginTop: 20,
    borderRadius: 4,
  },
  viewStyle: {
    width: itemWidth,
    height: itemHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
export default styles
export { titleOnFocusBackgroundColor, titleOnBlurBackgroundColor }
