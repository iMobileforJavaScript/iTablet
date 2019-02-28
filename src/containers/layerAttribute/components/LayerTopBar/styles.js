import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
})
