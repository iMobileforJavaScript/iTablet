import { StyleSheet, Platform } from 'react-native'
import { color } from '../../styles'
import { scaleSize } from '../../utils'

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	header: {
	  flex: 1,
	  flexDirection: 'row',
	  height: scaleSize(40),
    backgroundColor: color.USUAL_BLUE,
  },
  headerItem: {
	  flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
})
