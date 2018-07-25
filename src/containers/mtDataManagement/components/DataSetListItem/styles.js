import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: scaleSize(scaleSize(30)),
    paddingVertical: 5,
    marginLeft: scaleSize(30),
  },
  disableContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: color.gray3,
    paddingHorizontal: scaleSize(scaleSize(30)),
    paddingVertical: 5,
  },
  radioView: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(scaleSize(30)),
    borderWidth: scaleSize(2),
    borderColor: color.USUAL_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelected: {
    height: scaleSize(scaleSize(30)),
    width: scaleSize(scaleSize(30)),
    borderRadius: 5,
    backgroundColor: color.USUAL_BLUE,
  },
  radioViewGray: {
    marginLeft: scaleSize(30),
    height: scaleSize(30),
    width: scaleSize(30),
    borderRadius: scaleSize(scaleSize(30)),
    borderWidth: scaleSize(2),
    borderColor: color.gray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelectedGray: {
    height: scaleSize(scaleSize(30)),
    width: scaleSize(scaleSize(30)),
    borderRadius: 5,
    backgroundColor: color.gray,
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
    fontSize: scaleSize(30),
    marginLeft: scaleSize(30),
  },
})