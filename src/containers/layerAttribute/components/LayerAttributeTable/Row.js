/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { scaleSize } from '../../../../utils'
import { ListSeparator } from '../../../../components'
import { color } from '../../../../styles'
import Cell from './Cell'

const ROW_HEIGHT = scaleSize(80)
const CELL_WIDTH = 100

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
  indexCell: {
    height: ROW_HEIGHT - 1,
    backgroundColor: color.itemColorGray,
    paddingHorizontal: scaleSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: color.themeText2,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  indexCellText: {
    color: color.fontColorWhite,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})

export default class Row extends Component {
  props: {
    data: any,
    index: number,
    hasInputText?: boolean,
    renderCell?: () => {},
    style?: Object,
    cellStyle?: Object,
    cellTextStyle?: Object,
    cellWidthArr?: Array, // cell的宽度数组
    indexColumn?: number, // 每一行index所在的列，indexColumn >= 0 则所在列为Text
    indexCellStyle?: any, // 每一行index所在的列，indexColumn >= 0 则所在列样式
    indexCellTextStyle?: any, // 每一行index所在的列，indexColumn >= 0 则所在列文字样式
    onPress?: () => {},
    separatorColor?: () => {},
    onChangeEnd?: () => {},
  }

  static defaultProps = {
    indexColumn: -1,
    hasInputText: true,
  }

  _action = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      return this.props.onPress({
        item: this.props.data,
        index: this.props.index,
      })
    }
  }

  changeEnd = data => {
    if (
      this.props.onChangeEnd &&
      typeof this.props.onChangeEnd === 'function'
    ) {
      this.props.onChangeEnd({
        rowData: this.props.data,
        index: this.props.index,
        cellData: data.data,
        value: data.value,
      })
    }
  }

  _renderCell = (item, index) => {
    let width
    if (this.props.cellWidthArr && this.props.cellWidthArr.length > index) {
      width = this.props.cellWidthArr[index]
    } else if (this.props.data instanceof Array && this.props.data.length > 4) {
      width = CELL_WIDTH
    }
    if (this.props.renderCell && typeof this.props.renderCell === 'function') {
      return this.props.renderCell({ item, index })
    }
    let isSingleData = typeof item !== 'object'
    let value = isSingleData ? item : item.value
    let editable, isRequired, defaultValue
    if (isSingleData) {
      // 单个属性，第一列为名称
      if (index === 0) {
        editable = false
      } else {
        let isHead = typeof this.props.data[index] === 'string'
        editable = !isHead && !this.props.data.fieldInfo.isSystemField
        isRequired = !isHead && this.props.data.fieldInfo.isRequired
        defaultValue = !isHead && this.props.data.fieldInfo.defaultValue
      }
    } else {
      editable = item.fieldInfo && !item.fieldInfo.isSystemField
      isRequired = item.fieldInfo && !item.fieldInfo.isRequired
      defaultValue = item.fieldInfo && !item.fieldInfo.defaultValue
    }

    let cellStyle = [styles.cell, this.props.cellStyle],
      textStyle = [styles.cellText, this.props.cellTextStyle]
    if (
      (this.props.indexColumn >= 0 && this.props.indexColumn === index) ||
      !this.props.hasInputText
    ) {
      if (this.props.indexCellStyle) {
        cellStyle = [styles.cell, this.props.indexCellStyle]
      }
      if (this.props.indexCellTextStyle) {
        textStyle = [styles.cellText, this.props.indexCellTextStyle]
      }

      return (
        <TouchableOpacity
          activeOpacity={1}
          key={index}
          style={[
            cellStyle,
            width ? { width } : { flex: 1 },
            // { width },
          ]}
        >
          <Text style={[textStyle, width && { width: width - 4 }]}>
            {value}
          </Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <Cell
          key={index}
          style={[
            cellStyle,
            this.props.cellStyle,
            width ? { width } : { flex: 1 },
            // { width },
          ]}
          textStyle={[textStyle]}
          value={value}
          data={item}
          editable={editable}
          isRequired={isRequired}
          defaultValue={defaultValue}
          keyboardType={typeof value === 'number' ? 'decimal-pad' : 'default'}
          changeEnd={this.changeEnd}
        />
      )
    }
  }

  _renderCells = () => {
    if (this.props.data <= 0 || !this.props.data) return null
    let cells = []
    if (this.props.data instanceof Array) {
      this.props.data.forEach((item, index) => {
        cells.push(this._renderCell(item, index))
        if (index < this.props.data.length - 1) {
          cells.push(
            <ListSeparator
              color={this.props.separatorColor}
              key={'separator_' + index}
              mode={'vertical'}
            />,
          )
        }
      })
    } else if (this.props.data instanceof Object) {
      cells.push(this._renderCell(this.props.data['name'], 0))
      cells.push(
        <ListSeparator
          color={this.props.separatorColor}
          key={'separator'}
          mode={'vertical'}
        />,
      )
      cells.push(this._renderCell(this.props.data['value'], 1))
      // let keys = Object.keys(this.props.data)
      // keys.forEach((key, index) => {
      //   if (!isNaN(this.props.data[key]) || typeof this.props.data[key] === 'boolean' || typeof this.props.data[key] === 'string') {
      //     cells.push(this._renderCell(this.props.data[key], index))
      //     if (index < this.props.data.length - 1) {
      //       cells.push(<ListSeparator color={this.props.separatorColor} key={'separator_' + index} mode={'vertical'} />)
      //     }
      //   }
      // })
    }
    return cells
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this._action}>
        <View style={[styles.rowContainer, this.props.style]}>
          {this._renderCells()}
        </View>
      </TouchableOpacity>
    )
  }
}
