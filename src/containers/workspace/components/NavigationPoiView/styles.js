import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  nameView: {
    position: 'absolute',
    width: '100%',
    height: scaleSize(200),
    backgroundColor: color.contentColorWhite2,
    bottom: 0,
    borderBottomWidth: scaleSize(1),
    borderColor: color.separateColorGray,
  },
  text1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: scaleSize(50),
    height: scaleSize(40),
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flexDirection: 'row',
    height: scaleSize(60),
    width: '100%',
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
})
