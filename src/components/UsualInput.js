/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, TextInput, Image, Platform } from 'react-native'
import * as Util from '../utils/constUtil'

const BGCOLOR = Util.USUAL_GREEN
const BORDERCOLOR = Util.USUAL_SEPARATORCOLOR
const WIDTH = 300

export default class Input extends React.Component {
  props: {
    image: any,
    password: string,
    placeholder: string,
  }

  render() {
    const imagePath = this.props.image
      ? this.props.image
      : require('../assets/public/input.png') //add path
    const isPassword = this.props.password ? this.props.password : false
    const placeholder = this.props.placeholder
      ? this.props.placeholder
      : 'place'

    return (
      <View style={styles.container}>
        <View>
          <Image style={styles.image} source={imagePath} />
        </View>
        <View
          style={{ width: Util.USUAL_LINEWIDTH, backgroundColor: BORDERCOLOR }}
        />
        <TextInput
          accessible={true}
          accessibilityLabel={placeholder ? placeholder : '输入框'}
          style={styles.input}
          secureTextEntry={isPassword}
          placeholder={placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor={BORDERCOLOR}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: WIDTH,
    height: 40,
    backgroundColor: BGCOLOR,
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderWidth: 1,
    marginTop: 5,
  },
  image: {
    height: 30,
    width: 30,
    margin: 5,
  },
  input: {
    flex: 1,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
