import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: scaleSize(100),
    right: scaleSize(20),
    backgroundColor: 'white',
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(5),
    // maxHeight: (screen.deviceHeight - scaleSize(200)),
  },
  separator: {
    marginTop: scaleSize(10),
  },
})
