import { StyleSheet, Platform } from 'react-native'
import { scaleSize } from '../../utils'
import { size } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  colorPicker: {
    width: '60%',
    height: scaleSize(400),
    alignSelf: 'center',
  },
  rows: {
    flex: 1,
    marginTop: scaleSize(20),
    flexDirection: 'column',
    alignContent: 'center',
  },
  row: {
    height: scaleSize(60),
    width: '60%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    height: size.fontSize.fontSizeLg + scaleSize(8),
  },
  input: {
    flex: 1,
    height: scaleSize(80),
    paddingHorizontal: scaleSize(15),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    // backgroundColor: 'white',
    textAlign: 'center',
  },
  btns: {
    marginTop: scaleSize(30),
    marginBottom: scaleSize(60),
    marginHorizontal: scaleSize(60),
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
