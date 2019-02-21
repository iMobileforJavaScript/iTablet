/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { scaleSize } from '../../../../utils'
import { ListSeparator } from '../../../../components'
import { color } from '../../../../styles'

const ROW_HEIGHT = scaleSize(80)
const CELL_WIDTH = scaleSize(120)

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

export default class Row extends PureComponent {
  props: {
    data: any,
    index: number,
    renderCell?: () => {},
    style?: Object,
    cellStyle?: Object,
    cellTextStyle?: Object,
    cellWidthArr?: Array, // cell的宽度数组
    indexColumn?: number, // 每一行index所在的列，indexColumn >= 0 则所在列有背景色
    onPress?: () => {},
    separatorColor?: () => {},
  }

  static defaultProps = {
    indexColumn: -1,
  }

  _action = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      return this.props.onPress({
        item: this.props.data,
        index: this.props.index,
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
    let value =
      !isNaN(item) || typeof item === 'boolean' || typeof item === 'string'
        ? item
        : item.value
    let cellStyle = styles.cell,
      textStyle = styles.cellText
    if (this.props.indexColumn >= 0 && this.props.indexColumn === index) {
      cellStyle = styles.indexCell
      textStyle = styles.indexCellText
    }
    return (
      <View
        key={index}
        style={[
          cellStyle,
          this.props.cellStyle,
          width ? { width } : { flex: 1 },
        ]}
      >
        <Text style={[textStyle, this.props.cellTextStyle]}>{value}</Text>
      </View>
    )
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
