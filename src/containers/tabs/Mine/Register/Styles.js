import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
const itemWidth = '80%'
const itemHeight = 40
const fontSize = 16
const titleOnFocusBackgroundColor = color.blackBg
const titleOnBlurBackgroundColor = color.border
const styles = StyleSheet.create({
  container: {
    backgroundColor: color.border,
  },
  keyboardAvoidingStyle: {
    padding: 9,
    alignItems: 'center',
    flex: 1,
  },
  titleStyle: {
    flexDirection: 'row',
    width: itemWidth,
    height: itemHeight,
    marginTop: 20,
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
    width: '100%',
    height: itemHeight,
    fontSize: fontSize,
    borderBottomColor: color.borderLight,
    color: '#c0c0c0',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  registerStyle: {
    height: itemHeight,
    width: '50%',
    backgroundColor: color.blackBg,
    marginTop: 40,
    borderRadius: 4,
    alignItems: 'center',
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
    color: '#c0c0c0',
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
