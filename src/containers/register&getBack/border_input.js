/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  TouchableHighlight,
} from 'react-native'
import * as Util from '../../utils/constUtil'

const BGCOLOR = Util.USUAL_GREEN
const BORDERCOLOR = Util.USUAL_SEPARATORCOLOR
const DEFAULTWIDTH = 300

export default class BorderInput extends React.Component {
  props: {
    password: string,
    placeholder: string,
    width: number,
    textChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      secure: props.password ? props.password : false,
    }
  }

  _btnClick = () => {
    this.setState(oldState => {
      let newState = !oldState.secure
      return {
        secure: newState,
      }
    })
  }

  render() {
    const imagePath = this.state.secure
      ? require('../../assets/public/eye.png')
      : require('../../assets/public/eye-off.png')
    const isPassword = this.props.password ? this.props.password : false
    const placeholder = this.props.placeholder
      ? this.props.placeholder
      : 'place'
    const width = this.props.width ? this.props.width : DEFAULTWIDTH
    const textChange = this.props.textChange ? this.props.textChange : () => {}
    return (
      <View style={[styles.container, { width: width }]}>
        <View style={{ width: Util.USUAL_LINEWIDTH }} />
        <TextInput
          style={styles.input}
          accessible={true}
          accessibilityLabel={placeholder}
          secureTextEntry={this.state.secure}
          placeholder={placeholder}
          underlineColorAndroid="transparent"
          onChangeText={text => textChange(text)}
          placeholderTextColor={BORDERCOLOR}
        />
        {isPassword && (
          <TouchableHighlight
            underlayColor={Util.UNDERLAYCOLOR}
            onPress={this._btnClick}
          >
            <Image style={styles.image} source={imagePath} />
          </TouchableHighlight>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 300,
    height: 40,
    backgroundColor: BGCOLOR,
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderWidth: 1,
    borderRadius: 5,
  },
  btn: {
    height: 40,
    width: 40,
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
