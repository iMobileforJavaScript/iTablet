/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import React, { Component } from 'react'
import {
  Platform,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

const ROW_HEIGHT = scaleSize(80)
// const CELL_WIDTH = scaleSize(120)

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    height: ROW_HEIGHT,
    backgroundColor: color.bgW,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: color.bgG,
  },
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
    width: '100%',
    height: ROW_HEIGHT,
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
    width?: number,
    keyboardType?: String,
    editable?: boolean, // 是否可以调整可编辑状态
    isRequired?: boolean, // 是否不能为空
    style?: Object,
    textStyle?: Object,
    onPress?: () => {},
    separatorColor?: () => {},
    changeEnd?: () => {},
  }

  static defaultProps = {
    editable: true,
    keyboardType: 'default',
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
    if (
      this.props.keyboardType === 'number-pad' ||
      this.props.keyboardType === 'decimal-pad' ||
      this.props.keyboardType === 'numeric'
    ) {
      // TextInput中获取的是String
      // 为防止数字中以 '.' 结尾，转成数字
      let _value = parseFloat(this.state.value)
      if (isNaN(_value) || this.state.value === '') {
        if (this.props.defaultValue !== undefined) {
          _value = this.props.defaultValue
        } else {
          _value = 0
        }
      }
      this.state.editable &&
        this.setState({
          editable: false,
          value: _value,
        })
    } else {
      this.state.editable &&
        this.setState({
          editable: false,
        })
    }

    this.changeEnd()
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
      })
    }
  }

  _onEndEditing = () => {
    // this.state.editable && this.setState({
    //   editable: false,
    // })
  }

  _onSubmitEditing = () => {
    this.state.editable &&
      this.setState({
        editable: false,
      })
  }

  _setEditable = () => {
    if (!this.props.editable) return
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
      this.props.keyboardType === 'number-pad' ||
      this.props.keyboardType === 'decimal-pad' ||
      this.props.keyboardType === 'numeric'
    ) {
      if (isNaN(_value) && _value !== '') {
        _value = this.state.value
      }
    }
    this.setState({
      value: _value,
    })
  }

  render() {
    return (
      <View
        // activeOpacity={1}
        style={[
          styles.cell,
          this.props.style,
          !this.props.editable && { backgroundColor: color.borderLight },
          // this.props.width ? { width: this.props.width } : { flex: 1 },
        ]}
        // onLongPress={this._setEditable}
      >
        {/*<Text style={[textStyle, this.props.cellTextStyle]}>{value}</Text>*/}
        <TextInput
          ref={ref => (this.cellInput = ref)}
          // editable={this.state.editable && this.props.editable}
          // multiline = {true}
          value={this.state.value + ''}
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={this._onChangeText}
          onBlur={this._onBlur}
          onEndEditing={this._onEndEditing}
          onSubmitEditing={this._onSubmitEditing}
          returnKeyType={'done'}
          keyboardAppearance={'dark'}
          keyboardType={this.props.keyboardType}
        />
        {(!this.state.editable || !this.props.editable) && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.cellOverlay}
            onLongPress={this._setEditable}
          />
        )}
      </View>
    )
  }
}
