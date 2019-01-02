import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
let itemWidth = '80%'
const itemHeight = 40
const fontSize = 16
const titleOnFocusBackgroundColor = color.blackBg
const titleOnBlurBackgroundColor = color.border
let styles = StyleSheet.create({
  container: {
    backgroundColor: color.border,
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
    flexDirection: 'row',
    width: itemWidth,
    height: itemHeight,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'#aaaaaa',
  },
  titleContainerStyle: {
    fontSize: fontSize,
    lineHeight: itemHeight,
    height: itemHeight,
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
  loginStyle: {
    height: itemHeight,
    width: '50%',
    backgroundColor: color.blackBg,
    marginTop: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStyle: {
    width: '78%',
    height: itemHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomColor: '#ff00aa',
  },
})
export default styles
export { titleOnFocusBackgroundColor, titleOnBlurBackgroundColor }
