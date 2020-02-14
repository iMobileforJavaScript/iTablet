/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import RadioGroup from './RadioGroup'
import Radio from './Radio'
import ChooseNumber from './ChooseNumber'
import LabelBtn from './LabelBtn'
import ChooseColor from './ChooseColor'
import styles from './styles'
import { Input } from '../../components'

export default class Row extends PureComponent {
  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    customRightStyle?: StyleSheet,
    title: string,
    defaultValue?: any,
    customRgihtView?: any,
    type?: string,
    inputType?: string,
    value?: any,
    radioArr?: Array,
    radioColumn?: number,
    separatorHeight?: number,
    minValue?: number,
    maxValue?: number,
    getValue?: () => {},
    commonDifference?: number,
    times?: number,
    unit?: string,
    disable?: boolean,
  }

  static defaultProps = {
    type: 'input',
    inputType: 'default',
    value: '',
    disable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue,
      defaultValue: this.props.defaultValue || '',
      disable: this.props.disable,
    }
  }

  labelChange = text => {
    if (this.props.disable) return
    this.setState({
      value: text,
    })
    this.props.getValue &&
      this.props.getValue({ title: this.props.title, text })
  }

  getSelected = ({ title, selected, index, value }) => {
    this.props.getValue &&
      this.props.getValue({
        labelTitle: this.props.title,
        // value: title,
        title,
        value,
        selected,
        index,
      })
  }

  getValue = value => {
    this.props.getValue && this.props.getValue(value)
  }

  renderRight = () => {
    let right = <View />
    if (this.props.customRgihtView) {
      right = this.props.customRgihtView
    } else if (this.props.type === 'input') {
      right = (
        <View style={styles.inputView}>
          <TextInput
            keyboardType={
              this.props.inputType === 'numeric' ? 'numeric' : 'default'
            }
            style={[styles.input, this.props.customRightStyle]}
            accessible={true}
            value={this.state.value + ''}
            defaultValue={this.state.defaultValue + ''}
            disable={this.state.disable}
            accessibilityLabel={this.props.title}
            underlineColorAndroid="transparent"
            onChangeText={this.labelChange}
          />
          {this.props.disable && <View style={styles.inputOverLayer} />}
        </View>
      )
    } else if (this.props.type === 'input_wrap') {
      right = (
        <View style={[styles.inputWrap, styles.inputView]}>
          <Input
            inputStyle={this.props.customRightStyle}
            style={this.props.customRightStyle}
            accessible={true}
            accessibilityLabel={'输入框'}
            // placeholder={this.state.placeholder}
            // placeholderTextColor={color.themePlaceHolder}
            value={this.state.value + ''}
            // onChangeText={this.labelChange}
            onChangeText={text => {
              this.labelChange(text)
            }}
            onClear={() => {
              this.labelChange('')
            }}
            returnKeyType={'done'}
            showClear={!this.props.disable}
          />
          {this.props.disable && <View style={styles.inputOverLayer} />}
        </View>
      )
    } else if (this.props.type === 'radio_group') {
      right = (
        <RadioGroup
          data={this.props.radioArr}
          column={this.props.radioColumn}
          getSelected={this.getSelected}
          disable={this.state.disable}
          defaultValue={this.state.value}
          separatorHeight={this.props.separatorHeight}
        />
      )
    } else if (this.props.type === 'choose_number') {
      right = (
        <ChooseNumber
          maxValue={this.props.maxValue}
          minValue={this.props.minValue}
          defaultValue={this.props.defaultValue}
          value={this.props.value}
          disable={this.props.disable}
          getValue={this.getValue}
          unit={this.props.unit}
          times={this.props.times}
          commonDifference={this.props.commonDifference}
        />
      )
    } else if (this.props.type === 'text_btn') {
      right = (
        <LabelBtn
          title={this.props.title}
          value={this.props.value}
          getValue={this.getValue}
        />
      )
    } else if (this.props.type === 'choose_color') {
      right = (
        <ChooseColor
          disable={this.props.disable}
          title={this.props.title}
          value={this.props.value}
          getValue={this.getValue}
        />
      )
    } else if (this.props.type === 'radio') {
      // TODO 完善单选
      right = <Radio title={this.props.title} />
    }
    return right
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Text style={styles.rowLabel}>{this.props.title}</Text>
        {this.renderRight()}
      </View>
    )
  }
}

Row.Type = {
  INPUT: 'input',
  INPUT_WRAP: 'input_wrap',
  RADIO: 'radio',
  RADIO_GROUP: 'radio_group',
  CHOOSE_NUMBER: 'choose_number',
  CHOOSE_COLOR: 'choose_color',
  TEXT_BTN: 'text_btn',
}

Row.InputType = {
  NUMERIC: 'numeric',
  DEFAULT: 'default',
}
