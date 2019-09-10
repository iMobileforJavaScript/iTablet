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

export default class Input extends PureComponent {
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
    keyboardType?: string,
    textContentType?: string,
    secureTextEntry?: boolean,
    onChangeText?: () => {},
    onClear?: () => {},
  }

  static defaultProps = {
    label: '',
    keyboardAppearance: 'dark',
    returnKeyType: 'done',
    keyboardType: 'default',
    placeholder: '',
    placeholderTextColor: color.themePlaceHolder,
    showClear: false,
    isKeyboardAvoiding: false,
    secureTextEntry: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue || '',
    }
    this._value = props.value || props.defaultValue || '' // 实时输入的值
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== undefined) {
      if (
        this.props.value !== prevProps.value ||
        this.props.value !== this._value
      ) {
        this._value = this.props.value
        this.setState({
          value: this.props.value,
        })
      }
    } else if (this.props.defaultValue !== prevProps.defaultValue) {
      this._value = this.props.defaultValue
      this.setState({
        value: this.props.defaultValue,
      })
    }
  }

  clear = () => {
    if (this.props.onClear && typeof this.props.onClear === 'function') {
      this.props.onClear()
    }
    this.setState({
      value: '',
    })
  }

  focus = () => {
    this.textInput && this.textInput.focus()
  }

  blur = () => {
    this.textInput && this.textInput.blur()
  }

  renderClearBtn = () => {
    if (this.state.value === '') {
      return <View style={styles.clearBtn} />
    }
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
          ref={ref => (this.textInput = ref)}
          accessible={this.props.accessible}
          accessibilityLabel={this.props.accessibilityLabel}
          style={[styles.input, this.props.inputStyle]}
          placeholder={this.props.placeholder}
          underlineColorAndroid="transparent"
          placeholderTextColor={this.props.placeholderTextColor}
          textContentType={this.props.textContentType}
          secureTextEntry={this.props.secureTextEntry}
          defaultValue={this.props.defaultValue}
          value={this.state.value + ''}
          onChangeText={text => {
            if (
              this.props.keyboardType === 'number-pad' ||
              this.props.keyboardType === 'decimal-pad' ||
              this.props.keyboardType === 'numeric'
            ) {
              if (isNaN(text) && text !== '' && text !== '-') {
                text = this.state.value || ''
              }
            }
            this.props.onChangeText && this.props.onChangeText(text)
            this._value = text
            this.setState({
              value: text,
            })
          }}
          keyboardAppearance={this.props.keyboardAppearance}
          returnKeyType={this.props.returnKeyType}
          keyboardType={this.props.keyboardType}
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
