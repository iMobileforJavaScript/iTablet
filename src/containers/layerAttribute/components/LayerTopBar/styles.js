import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    // justifyContent: 'space-around',
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
  rightList: {
    flex: 1,
    height: scaleSize(80),
  },
  imgBtn: {
    height: scaleSize(80),
    width: scaleSize(200),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    height: scaleSize(80),
    width: scaleSize(100),
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: color.bgG,
  },
})
