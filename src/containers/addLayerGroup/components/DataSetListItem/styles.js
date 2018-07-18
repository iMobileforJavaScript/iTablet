import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 20,
  },
  disableContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: color.gray3,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  radioView: {
    marginLeft: 20,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.USUAL_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: color.USUAL_BLUE,
  },
  radioViewGray: {
    marginLeft: 20,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.gray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelectedGray: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: color.gray,
  },
  image: {
    height: 30,
    width: 30,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
  },
})