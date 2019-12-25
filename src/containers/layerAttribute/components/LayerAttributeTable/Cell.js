/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import React, { Component } from 'react'
import {
  Platform,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import utils from './utils'

const ROW_HEIGHT = scaleSize(80)
// const CELL_WIDTH = scaleSize(120)

const styles = StyleSheet.create({
  cell: {
    height: ROW_HEIGHT - 1,
    backgroundColor: 'transparent',
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: color.themeText2,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    width: '80%',
    // height: ROW_HEIGHT,
    backgroundColor: 'transparent',
    textAlign: 'center',
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  cellOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'transparent',
    backgroundColor: '#rgba(0, 0, 0, 0)',
  },
})

export default class Cell extends Component {
  props: {
    data: any,
    value: any,
    defaultValue?: any,
    cellTextStyle?: any,
    width?: number,
    index: number,
    delayLongPress: number,
    keyboardType?: String,
    returnKeyLabel?: String,
    editable?: boolean, // 是否可以调整可编辑状态
    isRequired?: boolean, // 是否不能为空
    style?: Object,
    textStyle?: Object,
    onPress?: () => {},
    onFocus?: () => {},
    separatorColor?: () => {},
    changeEnd?: () => {},
  }

  static defaultProps = {
    editable: true,
    returnKeyLabel: '完成',
    delayLongPress: 500,
  }

  state = {
    value: this.props.value,
    editable: false, // 是否可编辑，props中的editable为true时，该值才会生效
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      nextProps.value !== this.state.value
    return shouldUpdate
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.setState({ value: this.props.value })
    }
  }

  _onBlur = () => {
    this._onSubmitEditing()
  }
  _onFocus = evt => {
    this.props.onFocus && this.props.onFocus(evt)
  }
  changeEnd = () => {
    if (
      this.state.value !== this.props.value &&
      this.props.changeEnd &&
      typeof this.props.changeEnd === 'function'
    ) {
      this.props.changeEnd({
        data: this.props.data,
        value: this.state.value,
        index: this.props.index,
      })
    }
  }

  _onPress = evt => {
    this._onFocus(evt)
    if (this.props.index === 0) {
      if (this.props.onPress && typeof this.props.onPress === 'function') {
        this.props.onPress({
          data: this.props.data,
          value: this.state.value,
          index: this.props.index,
        })
      }
    } else {
      this._setEditable()
    }
  }

  _onEndEditing = () => {
    // this.state.editable && this.setState({
    //   editable: false,
    // })
  }

  _onSubmitEditing = () => {
    let _value = this.state.value
    if (
      (this.props.data.fieldInfo &&
        utils.isNumber(this.props.data.fieldInfo.type)) ||
      this.state.keyboardType === 'number-pad' ||
      this.state.keyboardType === 'decimal-pad' ||
      this.state.keyboardType === 'numeric'
    ) {
      // TextInput中获取的是String
      // 为防止数字中以 '.' 结尾，转成数字
      _value = utils.getValueWithDefault(
        _value,
        this.props.defaultValue,
        this.props.data.fieldInfo && this.props.data.fieldInfo.type,
      )
      this.state.editable &&
        this.setState(
          {
            editable: false,
            value: _value,
          },
          () => {
            this.changeEnd()
          },
        )
    } else {
      let newState = {
        editable: false,
      }
      if (
        _value === '' &&
        this.props.defaultValue !== undefined &&
        this.props.isRequired
      ) {
        newState.value = this.props.defaultValue
      } else {
        newState.value = _value
      }
      newState.value = utils.getValueWithDefault(
        newState.value,
        this.props.defaultValue,
        this.props.data.fieldInfo && this.props.data.fieldInfo.type,
      )
      this.state.editable &&
        this.setState(newState, () => {
          this.changeEnd()
        })
    }
  }

  _setEditable = () => {
    if (!this.props.editable || GLOBAL.Type === 'MAP_3D') return
    !this.state.editable &&
      this.setState(
        {
          editable: true,
        },
        () => {
          this.cellInput && this.cellInput.focus()
        },
      )
  }

  _onChangeText = value => {
    let _value = value
    if (
      (this.props.data.fieldInfo &&
        utils.isNumber(this.props.data.fieldInfo.type)) ||
      this.state.keyboardType === 'number-pad' ||
      this.state.keyboardType === 'decimal-pad' ||
      this.state.keyboardType === 'numeric'
    ) {
      if (isNaN(_value) && _value !== '' && _value !== '-') {
        _value = this.state.value
      }
    }
    this.setState({
      value: _value,
    })
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.cell, this.props.style]}
        activeOpacity={1}
        delayLongPress={this.props.delayLongPress}
        onPress={this._onPress}
      >
        {this.props.editable && this.state.editable ? (
          <TextInput
            ref={ref => (this.cellInput = ref)}
            value={this.state.value + ''}
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={this._onChangeText}
            onBlur={this._onBlur}
            onEndEditing={this._onEndEditing}
            onSubmitEditing={this._onSubmitEditing}
            returnKeyType={'done'}
            keyboardAppearance={'dark'}
            returnKeyLabel={this.props.returnKeyLabel}
            // keyboardType={this.state.keyboardType}
            keyboardType={utils.getKeyboardType(
              this.props.data.fieldInfo && this.props.data.fieldInfo.type,
            )}
          />
        ) : (
          <Text style={[styles.cellText, this.props.cellTextStyle]}>
            {this.state.value + ''}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
}
