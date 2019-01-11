import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
let itemWidth = '70%'
const itemHeight = 40
const fontSize = 16
const titleOnFocusBackgroundColor = color.theme
const titleOnBlurBackgroundColor = color.content
let styles = StyleSheet.create({
  container: {
    backgroundColor: color.content,
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
    height: itemHeight - 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderColor: color.theme,
    borderWidth: 2,
  },
  titleContainerStyle: {
    color: 'white',
    fontSize: fontSize,
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
  loginStyle: {
    height: itemHeight,
    width: '50%',
    backgroundColor: color.theme,
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
