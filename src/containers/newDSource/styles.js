import { StyleSheet, Platform } from 'react-native'
import { constUtil } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: constUtil.USUAL_GREEN,
    alignItems: 'center',
    paddingTop:10,
  },
  input: {
    width: 0.75 * constUtil.WIDTH,
    height: 40,
    borderStyle: 'solid',
    borderColor: constUtil.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  textContainer:{
    height:40,
    width:0.75* constUtil.WIDTH,
  },
})