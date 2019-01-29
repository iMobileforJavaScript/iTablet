import { StyleSheet } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
let itemWidth = '70%'
const itemHeight = scaleSize(54)
const fontSize = size.fontSize.fontSizeXl
const titleOnFocusBackgroundColor = color.itemColorBlack
const titleOnBlurBackgroundColor = color.itemColorWhite
let styles = StyleSheet.create({
  container: {
    backgroundColor: color.contentColorWhite,
  },
  keyboardAvoidingStyle: {
    padding: 9,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    // backgroundColor:'orange',
  },
  titleStyle: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    width: itemWidth,
    height: itemHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainerStyle: {
    // color: color.fontColorWhite,
    color: color.fontColorGray,
    fontSize: fontSize,
    textAlign: 'center',
  },
  textInputStyle: {
    width: '100%',
    height: itemHeight,
    fontSize: fontSize,
    borderBottomColor: color.borderLight,
    color: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  loginStyle: {
    height: itemHeight,
    width: '50%',
    backgroundColor: color.itemColorBlack,
    marginTop: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  probationStyle: {
    height: itemHeight,
    width: '50%',
    marginTop: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStyle: {
    width: '70%',
    height: itemHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomColor: '#ff00aa',
  },
})
export default styles
export { titleOnFocusBackgroundColor, titleOnBlurBackgroundColor }
