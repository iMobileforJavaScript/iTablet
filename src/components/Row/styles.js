import { StyleSheet, Platform } from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  rowLabel: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'left',
  },

  contentView: {
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    // minHeight: scaleSize(80),
    backgroundColor: 'transparent',
  },

  /** Radio **/
  radioContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  radioView: {
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: scaleSize(2),
    borderColor: color.USUAL_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelected: {
    height: scaleSize(15),
    width: scaleSize(15),
    borderRadius: scaleSize(9),
    backgroundColor: color.USUAL_BLUE,
  },
  radioViewGray: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: scaleSize(2),
    borderColor: color.gray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelectedGray: {
    height: scaleSize(15),
    width: scaleSize(15),
    borderRadius: scaleSize(9),
    backgroundColor: color.gray,
  },
  radioTitle: {
    marginLeft: scaleSize(10),
    fontSize: scaleSize(28),
    backgroundColor: 'transparent',
  },
  input: {
    flex: 2,
    height: scaleSize(80),
    paddingHorizontal: scaleSize(15),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
  },

  /** RadioGroup **/
  radioGroupContainer: {
    flex: 2,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: 'transparent',
  },
  radioGroupRow: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: scaleSize(60),
  },

  /** ChooseNumber **/
  chooseNumberContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // minHeight: scaleSize(80),
  },
  imageBtnView: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    backgroundColor: color.USUAL_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disableImageBtnView: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    backgroundColor: color.grayL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBtn: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderRadius: scaleSize(15),
  },
  numberTitle: {
    flex: 1,
    marginLeft: scaleSize(10),
    fontSize: scaleSize(28),
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  /** LabelBtn **/
  textBtnContainer: {
    flex: 2,
    backgroundColor: color.grayLight,
    borderRadius: scaleSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: scaleSize(60),
  },
  textBtnTitle: {
    marginVertical: scaleSize(8),
    fontSize: scaleSize(28),
    backgroundColor: 'transparent',
  },

  /** ChooseColor **/
  chooseColorContainer: {
    flex: 2,
    minHeight: scaleSize(60),
    borderWidth: scaleSize(1),
    borderColor: color.title,
    padding: scaleSize(2),
  },
  subChooseColorContainer: {
    flex: 1,
  },
})
