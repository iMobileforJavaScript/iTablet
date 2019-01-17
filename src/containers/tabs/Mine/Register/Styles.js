import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
const itemWidth = '70%'
const itemHeight = 40
const fontSize = 16
const titleOnFocusBackgroundColor = color.item_separate_white
const titleOnBlurBackgroundColor = color.content_white
const styles = StyleSheet.create({
  container: {
    backgroundColor: color.content_white,
  },
  keyboardAvoidingStyle: {
    padding: 9,
    alignItems: 'center',
    flex: 1,
  },
  titleStyle: {
    flexDirection: 'row',
    width: itemWidth,
    height: itemHeight - 8,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderColor: color.item_separate_white,
    borderWidth: 2,
  },
  titleContainerStyle: {
    fontSize: fontSize,
    color: color.font_color_white,
    textAlign: 'center',
  },
  textInputStyle: {
    width: '100%',
    height: itemHeight,
    fontSize: fontSize,
    borderBottomColor: color.borderLight,
    color: color.font_color_white,
    borderBottomWidth: 1,
    marginTop: 10,
  },
  registerStyle: {
    height: itemHeight,
    width: '50%',
    backgroundColor: color.item_separate_white,
    marginTop: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyCodeViewStyle: {
    width: '100%',
    height: itemHeight,
    marginTop: 10,
    borderBottomColor: color.borderLight,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  verifyCodeLTextStyle: {
    flex: 1,
    fontSize: fontSize,
    color: color.theme_white,
    height: itemHeight,
  },
  verifyCodeRTextStyle: {
    width: 100,
    fontSize: 12,
    color: color.blue1,
    lineHeight: itemHeight,
    textAlign: 'right',
  },
})
export default styles
export { titleOnFocusBackgroundColor, titleOnBlurBackgroundColor }
