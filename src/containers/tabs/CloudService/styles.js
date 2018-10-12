import { StyleSheet } from 'react-native'
import { WIDTH, USUAL_GREEN, USUAL_SEPARATORCOLOR } from '../../../utils/constUtil'

const HEIGHT = 120

export default StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: USUAL_GREEN,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
  },
  content: {
    margin: 5,
    height: HEIGHT - 5 * 4 + 2,
    width: WIDTH - 60 - 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarImage: {
    height: HEIGHT - 5 * 4,
    width: HEIGHT - 5 * 4,
    borderColor: USUAL_SEPARATORCOLOR,
    borderWidth: 1,
    borderRadius: 5,
  },
  textContainer: {
    height: 35,
    margin: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
  },
  btnImage: {
    height: 40,
    width: 40,
  },
})