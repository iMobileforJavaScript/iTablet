/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native'
import styles from './styles'

class NumberCounter extends Component {
  props: {
    containerStyle?: StyleSheet,
    type?: string,
    valueStyle?: StyleSheet,
    value: number,
    defaultValue: number,
    getValue?: () => {},
    unit?: string,
    minValue: number,
    maxValue: number,
    times?: number,
    commonDifference?: number,
    disable?: boolean,
  }

  static defaultProps = {
    type: 'default', // default | input
    unit: '',
    value: '',
    minValue: '',
    maxValue: '',
    defaultValue: 2,
    times: 1,
    commonDifference: 1,
    disable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: (props.value !== '' && props.value) || props.defaultValue,
      plusAble: props.maxValue === '' || props.defaultValue < props.maxValue,
      miusAble: props.minValue === '' || props.defaultValue > props.minValue,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.value !== this.props.value ||
      this.props.value !== this.state.value
    ) {
      if (this.props.value !== '') {
        this.setState({
          value: this.props.value,
          plusAble:
            this.props.maxValue === '' ||
            this.props.value < this.props.maxValue,
          miusAble:
            this.props.minValue === '' ||
            this.props.value > this.props.minValue,
        })
      } else if (this.props.value === '' && this.props.type === 'input') {
        this.setState({
          value: '',
          plusAble: false,
          miusAble: false,
        })
      }
    }
  }

  minus = () => {
    if (this.props.disable || this.state.value === '') return
    if (this.props.minValue === '' || this.state.value > this.props.minValue) {
      let cValue = parseFloat(this.state.value)
      let value =
        this.props.times > 1
          ? cValue / this.props.times
          : cValue - this.props.commonDifference
      let dec = this.props.commonDifference.toString().split('.')[1]
      if (dec) {
        value = parseFloat(value.toFixed(dec.length))
      }
      this.setState(
        {
          value:
            this.props.minValue !== '' && value < this.props.minValue
              ? this.props.minValue
              : value,
          miusAble: this.props.minValue === '' || value > this.props.minValue,
          plusAble: this.props.maxValue === '' || value < this.props.maxValue,
        },
        () => {
          this.props.getValue && this.props.getValue(this.state.value)
        },
      )
    } else {
      this.props.getValue && this.props.getValue(this.state.value)
    }
  }

  plus = () => {
    if (this.props.disable || this.state.value === '') return
    if (this.props.maxValue === '' || this.state.value < this.props.maxValue) {
      let cValue = parseFloat(this.state.value)
      let value =
        this.props.times > 1
          ? cValue * this.props.times
          : cValue + this.props.commonDifference
      let dec = this.props.commonDifference.toString().split('.')[1]
      if (dec) {
        value = parseFloat(value.toFixed(dec.length))
      }
      this.setState(
        {
          value:
            this.props.maxValue !== '' && value > this.props.maxValue
              ? this.props.maxValue
              : value,
          plusAble: this.props.maxValue === '' || value < this.props.maxValue,
          miusAble: this.props.minValue === '' || value > this.props.minValue,
        },
        () => {
          this.props.getValue && this.props.getValue(this.state.value)
        },
      )
    } else {
      this.props.getValue && this.props.getValue(this.state.value)
    }
  }

  render() {
    return (
      <View style={[styles.chooseNumberContainer, this.props.containerStyle]}>
        <TouchableOpacity
          disable={!this.state.miusAble}
          style={
            this.state.miusAble && !this.props.disable
              ? styles.imageBtnView
              : styles.disableImageBtnView
          }
          onPress={() => this.minus()}
        >
          <Image
            style={styles.imageBtn}
            source={require('../../assets/mapTool/icon_minus.png')}
          />
        </TouchableOpacity>
        {this.props.type === 'input' ? (
          <TextInput
            underlineColorAndroid={'transparent'}
            onChangeText={text => {
              if (text === '' || (!isNaN(text) && text !== this.state.value)) {
                if (
                  this.props.maxValue !== '' &&
                  text !== '' &&
                  text > this.props.maxValue
                )
                  text = this.props.maxValue
                if (
                  this.props.minValue !== '' &&
                  text !== '' &&
                  text < this.props.minValue
                )
                  text = this.props.minValue
                this.props.getValue && this.props.getValue(text)
              }
            }}
            value={this.state.value + ''}
            style={styles.input}
            keyboardType={'number-pad'}
          />
        ) : (
          <Text style={[styles.numberTitle, this.props.valueStyle]}>
            {this.state.value + ' ' + this.props.unit}
          </Text>
        )}
        <TouchableOpacity
          disable={!this.state.plusAble}
          style={
            this.state.plusAble && !this.props.disable
              ? styles.imageBtnView
              : styles.disableImageBtnView
          }
          onPress={() => this.plus()}
        >
          <Image
            style={styles.imageBtn}
            source={require('../../assets/mapTool/icon_plus.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

export default NumberCounter
