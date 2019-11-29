import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  nameView: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: scaleSize(20),
    backgroundColor: color.contentWhite,
  },
  text1: {
    fontSize: setSpText(24),
  },
  info: {
    paddingTop: scaleSize(20),
    fontSize: setSpText(20),
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    height: scaleSize(80),
  },
  search: {
    marginTop: scaleSize(20),
    height: scaleSize(60),
    flex: 1,
    borderRadius: 5,
    backgroundColor: color.blue1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTxt: {
    fontSize: setSpText(20),
    color: color.white,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  itemView1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBox: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: scaleSize(40),
    height: scaleSize(40),
    zIndex: 100,
  },
  closeBtn: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})
