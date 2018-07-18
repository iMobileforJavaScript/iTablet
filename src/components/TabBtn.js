/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com 
*/

import * as React from 'react'
import { View, StyleSheet, TouchableHighlight, Image } from 'react-native'
import * as Util from '../utils/constUtil'

const bgColor = 'transparent'

export default class CheckBox extends React.Component {

	render() {
		return (
			<View></View>
		)
	}
}

const styles = StyleSheet.create({
	btn: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: 20,
		width: 20,
		borderRadius: 5,
		backgroundColor: bgColor,
	},
	btn_image: {
		height: 20,
		width: 20,
	},
})