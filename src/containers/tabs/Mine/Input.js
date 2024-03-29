/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, TextInput, Image } from 'react-native'
import * as Util from '../../../utils/constUtil'

const BGCOLOR = Util.USUAL_GREEN
const BORDERCOLOR = Util.USUAL_SEPARATORCOLOR
const WIDTH = 300

export default class Input extends React.Component {

  props: {
    image: any,
    password: string,
    placeholder: string,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }

  getValue = () => {
    return this.state.value
  }

  render() {
    const imagePath = this.props.image ? this.props.image : require('../../../assets/public/input.png') //add path
    const isPassword = this.props.password ? this.props.password : false
    const placeholder = this.props.placeholder ? this.props.placeholder : 'place'

    return (
      <View style={styles.container}>
        <View>
          <Image style={styles.image} source={imagePath} />
        </View>
        <View style={{width:Util.USUAL_LINEWIDTH,backgroundColor: BORDERCOLOR }}/>
        <TextInput
          style={styles.input}
          accessible={true}
          value={this.state.value}
          accessibilityLabel={placeholder}
          secureTextEntry={isPassword}
          placeholder={placeholder}
          underlineColorAndroid='transparent'
          placeholderTextColor={BORDERCOLOR}
          onChangeText={text => { this.setState({ value: text }) }}/>
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
    // ...Platform.select({
    //   android: {
    //     paddingVertical: 0,
    //     paddingHorizontal: 8,
    //   },
    // }),
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
})