/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native'
import { color } from '../../styles'

import styles from './styles'

export default class Radio extends PureComponent {
  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    inputStyle?: StyleSheet,
    placeholder?: string,
    inputValue?: string,
    title: string,
    value: any,
    value?: string,
    selected: boolean,
    selectable: boolean,
    hasInput?: boolean,
    keyboardType?: string,
    returnKeyLabel?: string,
    returnKeyType?: string,
    index?: number,
    onPress?: () => {},
    onFocus?: () => {},
    onBlur?: () => {},
    onSubmitEditing?: () => {},
    onChangeText?: () => {},
  }

  static defaultProps = {
    type: 'input',
    keyboardType: 'default',
    returnKeyLabel: '完成',
    returnKeyType: 'done',
    placeholder: '',
    selected: false,
    hasInput: false,
    selectable: true,
  }

  constructor(props) {
    super(props)
    let inputValue = props.inputValue !== undefined ? props.inputValue : ''
    this.state = {
      selected: props.selected,
      inputValue,
      selection: { start: 0, end: inputValue.length - 1 },
    }
    this.submitting = false // android防止onblur和submit依次触发
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.selected !== this.props.selected &&
      prevProps.selected !== this.props.selected
    ) {
      let state = {}
      state.selected = this.props.selected
      if (this.props.selected) {
        state.selection = { start: 0, end: this.state.inputValue.length - 1 }
      }
      this.setState(state)
    }
  }

  select = selected => {
    let sel = selected
    if (selected === undefined) {
      sel = !this.state.selected
    }
    this.setState(
      {
        selected: sel,
      },
      () => {
        if (this.state.selected && this.props.hasInput) {
          this.input && this.input.focus()
        }
      },
    )
  }

  selectAction = selected => {
    if (this.state.selected) return
    this.select(selected)
    let sel = selected
    if (selected === undefined) {
      sel = !this.state.selected
    }
    this.onPress(sel)
  }

  onPress = () => {
    this.props.onPress &&
      this.props.onPress({
        title: this.props.title,
        value: this.props.value,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index,
      })
  }

  onFocus = () => {
    this.props.onFocus &&
      this.props.onFocus({
        title: this.props.title,
        value: this.props.value,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index,
      })
    this.input && this.input.focus()
  }

  onSubmitEditing = () => {
    if (Platform.OS === 'ios' || !this.submitting) {
      this.props.onSubmitEditing &&
        this.props.onSubmitEditing({
          title: this.props.title,
          value: this.props.value,
          inputValue: this.state.inputValue,
          selected: this.state.selected,
          index: this.props.index,
        })
    } else {
      this.submitting = false
    }
  }

  onChangeText = text => {
    if (
      this.props.keyboardType === 'number-pad' ||
      this.props.keyboardType === 'decimal-pad' ||
      this.props.keyboardType === 'numeric'
    ) {
      if (isNaN(text) && text !== '' && text !== '-') {
        text = this.state.inputValue
      }
    }
    if (
      this.props.onChangeText &&
      typeof this.props.onChangeText === 'function'
    ) {
      this.props.onChangeText({
        title: this.props.title,
        value: text,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index,
      })
    }
    this.setState({ inputValue: text })
  }

  onBlur = () => {
    // Android blur不会触发onSubmitEditing
    if (Platform.OS === 'android') {
      this.submitting = true
      // this.props.onSubmitEditing &&
      // this.props.onSubmitEditing({
      //   title: this.props.title,
      //   value: this.props.value,
      //   inputValue: this.state.inputValue,
      //   selected: this.state.selected,
      //   index: this.props.index,
      // })
    }
    this.props.onBlur &&
      this.props.onBlur({
        title: this.props.title,
        value: this.props.value,
        inputValue: this.state.inputValue,
        selected: this.state.selected,
        index: this.props.index,
      })
  }

  render() {
    let viewStyle = styles.radioView,
      dotStyle = styles.radioSelected
    if (!this.props.selectable) {
      viewStyle = styles.radioViewGray
      dotStyle = styles.radioSelectedGray
    }

    if (this.props.selectable) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.radioContainer, this.props.style]}
          accessible={true}
          accessibilityLabel={this.props.title}
          onPress={() => this.selectAction()}
        >
          <View style={viewStyle}>
            {this.state.selected && <View style={dotStyle} />}
          </View>
          {this.props.title && (
            <Text style={[styles.radioTitle, this.props.titleStyle]}>
              {this.props.title}
            </Text>
          )}
          {this.props.hasInput &&
            (this.state.selected ? (
              <TextInput
                ref={ref => (this.input = ref)}
                underlineColorAndroid={'transparent'}
                style={[styles.input2, this.props.inputStyle]}
                placeholder={this.props.placeholder}
                keyboardType={this.props.keyboardType}
                value={this.state.inputValue + ''}
                returnKeyLabel={this.props.returnKeyLabel}
                returnKeyType={this.props.returnKeyType}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitEditing}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                selectTextOnFocus={true}
              />
            ) : (
              <View
                style={[styles.textView, { borderColor: color.fontColorGray }]}
              >
                <Text
                  style={[
                    styles.text,
                    { color: color.fontColorGray },
                    this.props.inputStyle,
                  ]}
                >
                  {this.state.inputValue}
                </Text>
              </View>
            ))}
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={[styles.radioContainer, this.props.style]}>
          <View style={viewStyle}>
            {this.state.selected && <View style={dotStyle} />}
          </View>
          {this.props.title && (
            <Text style={[styles.radioTitle, this.props.titleStyle]}>
              {this.props.title}
            </Text>
          )}
          {this.props.hasInput && (
            <View style={styles.textView}>
              <Text style={[styles.text, this.props.inputStyle]}>
                {this.state.inputValue}
              </Text>
            </View>
          )}
        </View>
      )
    }
  }
}
