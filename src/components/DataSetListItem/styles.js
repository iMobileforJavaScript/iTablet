import { StyleSheet } from 'react-native'
import { color } from '../../styles'
import { scaleSize, setSpText } from '../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  topContainer: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: scaleSize(80),
    paddingVertical: 5,
    marginLeft: scaleSize(30),
  },
  disableContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: color.gray3,
    paddingHorizontal: scaleSize(30),
    paddingVertical: 5,
  },
  radioView: {
    marginLeft: scaleSize(30),
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
    height: scaleSize(20),
    width: scaleSize(20),
    borderRadius: scaleSize(10),
    backgroundColor: color.USUAL_BLUE,
  },
  radioViewGray: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(30),
    borderWidth: scaleSize(2),
    borderColor: color.gray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelectedGray: {
    height: scaleSize(20),
    width: scaleSize(20),
    borderRadius: scaleSize(10),
    backgroundColor: color.gray,
  },
  contentView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(40),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageView: {
    height: scaleSize(40),
    width: scaleSize(40),
    marginLeft: scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  imageSmall: {
    height: scaleSize(20),
    width: scaleSize(20),
  },
  title: {
    fontSize: setSpText(30),
    marginLeft: scaleSize(30),
  },
  textMarginRight: {
    marginRight: scaleSize(30),
  },
})
