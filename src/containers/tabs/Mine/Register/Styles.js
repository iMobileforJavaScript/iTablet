import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
const itemWidth = '70%'
const itemHeight = 80
const fontSize = 23
const titleOnFocusBackgroundColor = color.itemColorBlack
const titleOnBlurBackgroundColor = color.itemColorWhite
const styles = StyleSheet.create({
  container: {
    backgroundColor: color.contentColorWhite,
  },
  keyboardAvoidingStyle: {
    padding: 9,
    alignItems: 'center',
    flex: 1,
  },
  titleStyle: {
    flexDirection: 'row',
    width: itemWidth,
    height: scaleSize(itemHeight),
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderColor: color.borderColorBlack,
    borderWidth: 2,
  },
  titleContainerStyle: {
    fontSize: scaleSize(fontSize),
    color: color.fontColorGray,
    textAlign: 'center',
  },
  textInputStyle: {
    width: '100%',
    height: scaleSize(itemHeight),
    fontSize: scaleSize(fontSize),
    borderBottomColor: color.borderLight,
    color: color.fontColorGray,
    borderBottomWidth: 1,
    marginTop: 10,
  },
  registerStyle: {
    height: scaleSize(itemHeight),
    width: '50%',
    backgroundColor: color.itemColorBlack,
    marginTop: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyCodeViewStyle: {
    width: '100%',
    height: scaleSize(itemHeight),
    marginTop: 10,
    borderBottomColor: color.borderLight,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  verifyCodeLTextStyle: {
    flex: 1,
    fontSize: fontSize,
    color: color.fontColorBlack,
    height: scaleSize(itemHeight),
  },
  verifyCodeRTextStyle: {
    width: 100,
    fontSize: 12,
    color: color.blue1,
    lineHeight: scaleSize(itemHeight),
    textAlign: 'right',
  },
})
export default styles
export { titleOnFocusBackgroundColor, titleOnBlurBackgroundColor, fontSize }
