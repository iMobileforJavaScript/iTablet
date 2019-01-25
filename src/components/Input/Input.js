/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from 'react-native'
import { color } from '../../styles'
import styles from './styles'

export default class InputDialog extends PureComponent {
  props: {
    accessible?: boolean,
    accessibilityLabel?: string,
    showClear?: boolean,
    isKeyboardAvoiding?: boolean,
    behavior?: string,
    style?: Object,
    inputStyle?: Object,
    placeholder: string,
    value: string,
    defaultValue: string,
    keyboardAppearance: string,
    returnKeyType?: string,
    placeholderTextColor?: string,
    onChangeText?: () => {},
  }

  static defaultProps = {
    label: '',
    value: '',
    keyboardAppearance: 'dark',
    returnKeyType: 'done',
    placeholder: '',
    placeholderTextColor: color.themePlaceHolder,
    showClear: false,
    isKeyboardAvoiding: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  clear = () => {
    this.setState({
      value: '',
    })
  }

  renderClearBtn = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.clearBtn}
        onPress={this.clear}
      >
        <Image
          style={styles.clearImg}
          resizeMode={'contain'}
          source={require('../../assets/public/icon_input_clear.png')}
        />
      </TouchableOpacity>
    )
  }

  renderInput = () => {
    return (
      <View style={[styles.inputContainer, this.props.style]}>
        <TextInput
          accessible={this.props.accessible}
          accessibilityLabel={this.props.accessibilityLabel}
          style={[styles.input, this.props.inputStyle]}
          placeholder={this.props.placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor={this.props.placeholderTextColor}
          value={this.state.value + ''}
          onChangeText={text => {
            this.props.onChangeText && this.props.onChangeText(text)
            this.setState({
              value: text,
            })
          }}
          keyboardAppearance={this.props.keyboardAppearance}
          returnKeyType={this.props.returnKeyType}
        />
        {this.props.showClear && this.renderClearBtn()}
      </View>
    )
  }

  render() {
    if (this.props.isKeyboardAvoiding) {
      return (
        <KeyboardAvoidingView behavior={this.props.behavior} enabled>
          {this.renderInput()}
        </KeyboardAvoidingView>
      )
    } else {
      return this.renderInput()
    }
  }
}
