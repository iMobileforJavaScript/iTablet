import { StyleSheet, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color, size } from '../../../../styles'
export default StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white',
    // padding: scaleSize(20),
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: 17,
  },
  btns: {
    height: scaleSize(60),
    // width: '90%',
    // flexDirection: 'row',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // marginHorizontal: scaleSize(150),
    alignItems: 'center',
    marginVertical: scaleSize(100),
  },
  rows: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: scaleSize(60),
    backgroundColor: 'transparent',
  },
  saveAndContinueImage: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  saveAndContinueView2: {
    flexDirection: 'row',
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveAndContinueText: {
    fontSize: setSpText(24),
    textAlign: 'center',
    color: color.blue2,
  },
  input: {
    height: scaleSize(50),
    paddingHorizontal: scaleSize(15),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
  },
  defaultValueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rowLabel: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'left',
  },
  inputOverLayer: {
    position: 'absolute',
    right: 1,
    top: 1,
    left: 1,
    bottom: 1,
    borderRadius: scaleSize(8),
    backgroundColor: '#rgba(0, 0, 0, 0.1)',
  },
  inputView: {
    flex: 2,
  },
  customRightStyle: {
    height: scaleSize(50),
    textAlign: 'left',
    fontSize: scaleSize(20),
  },
})
