import { StyleSheet, Platform } from 'react-native'
import { color } from '../../styles'

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	iOSPadding: {
		paddingTop: Platform.OS === 'ios' ? 20 : 0,
	},
	blue: {
		backgroundColor: color.blue2,
	}
})
