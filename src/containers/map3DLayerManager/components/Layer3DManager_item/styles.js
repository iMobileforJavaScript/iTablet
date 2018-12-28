import { StyleSheet } from 'react-native'
import * as Util from '../../../../utils/constUtil'

export default StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: "space-between",
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#bbbbbb',
  },
  rowOne: {
    flex: 1,
    height: 46,
    // width: Util.WIDTH,
    padding: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn_container: {
    height: 40,
    width: 46 * 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    height: 40,
    width: 40,
    marginLeft: 3,
    marginRight: 3,
  },
  btn_image: {
    height: 40,
    width: 40,
  },
  text_container: {
    flex: 1,
    alignItems: 'center',
  },
  rowTwo: {
    height: 46,
    width: Util.WIDTH,
    backgroundColor: 'white',
  },
})
