import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const itemWidth = Dimensions.get('window').width*0.8
const itemHeight = 40
const fontSize = 16
const titleOnFocusBackgroundColor = color.blackBg
const titleOnBlurBackgroundColor = color.border
const styles = StyleSheet.create({
  container: {
    backgroundColor: color.border,
  },
  keyboardAvoidingStyle:{
    padding: 9 ,
    alignItems: 'center',
    width:screenWidth,
    height:screenHeight,
  },
  titleStyle:{
    marginTop:20,
    flexDirection: 'row',
    width:itemWidth,
    height:itemHeight,
    marginBottom: 20,
  },
  titleContainerStyle:{
    flex:1,
    fontSize:fontSize,
    lineHeight:itemHeight,
    color:'white',
    textAlign: 'center'
  },
  textInputStyle:{
    width:itemWidth,
    height: itemHeight,
    fontSize:fontSize,
    borderBottomColor:color.borderLight,
    color:'#c0c0c0',
    borderBottomWidth:1,
    marginTop:10,
  },
  registerStyle:{
    height:itemHeight,
    width:itemWidth*0.6,
    backgroundColor:color.blackBg,
    marginTop:40,
    borderRadius:4
  },
  verifyCodeViewStyle:{
    width:itemWidth,
    height:itemHeight,
    marginTop:10,
    borderBottomColor:color.borderLight,
    borderBottomWidth:1,
    flexDirection: 'row'
  }
  ,
  verifyCodeLTextStyle:{
    flex:1,
    fontSize:fontSize,
    color:'#c0c0c0',
    height:itemHeight,
  },
  verifyCodeRTextStyle:{
    width:100,
    fontSize:12,
    color:color.blue1,
    lineHeight:itemHeight,
    textAlign: 'right',
  },
})
export default styles
export {
  titleOnFocusBackgroundColor,
  titleOnBlurBackgroundColor,
}
