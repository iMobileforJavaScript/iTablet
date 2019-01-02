/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView, View } from 'react-native'

import styles from './styles'

export default class ColorTableList extends React.Component {
  props: {
    data: Array,
    numColumns?: number,
    lineSeparator?: number,
    style?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    renderCell: () => {},
    device: Object,

    type?: string,
  }

  static defaultProps = {
    data: [],
    numColumns: 8,
    type: 'normal', // normal | scroll
    lineSeparator: 10,
  }

  renderRows = () => {
    let rows = [],
      rowsView = []
    this.props.data.forEach((item, index) => {
      let column =
        this.props.device.orientation === 'LANDSCAPE'
          ? 12
          : this.props.numColumns
      let rowIndex = Math.floor(index / column)
      if (!rows[rowIndex]) {
        rows[rowIndex] = []
      }
      rows[rowIndex].push(this.renderCell(item, rowIndex, index))
    })

    rows.forEach((row, rowIndex) => {
      rowsView.push(this.renderRow(row, rowIndex))
    })
    return rowsView
  }

  renderRow = (row, rowIndex) => {
    return (
      <View
        key={'row-' + rowIndex}
        style={[
          styles.row,
          // rowIndex &&
          //   this.props.lineSeparator >= 0 && {
          //   marginTop: this.props.lineSeparator,
          // },
          // {
          //   marginLeft: (screen.deviceWidth - scaleSize(80) * this.props.numColumns) / 2,
          //   marginRight: (screen.deviceWidth - scaleSize(80) * this.props.numColumns) / 2,
          // },
        ]}
      >
        {row}
      </View>
    )
  }

  renderCell = (item, rowIndex, cellIndex) => {
    if (!this.props.renderCell) throw new Error('Please render cell')
    let column =
      this.props.device.orientation === 'LANDSCAPE' ? 12 : this.props.numColumns
    return (
      <View
        style={{ width: this.props.device.width / column }}
        // style={{ width: (screen.deviceWidth - scaleSize(80) * this.props.numColumns) / this.props.numColumns }}
        // style={{ width: scaleSize(80) }}
        key={rowIndex + '-' + cellIndex}
      >
        {this.props.renderCell({ item, rowIndex, cellIndex })}
      </View>
    )
  }

  render() {
    if (this.props.type === 'scroll') {
      return (
        <ScrollView style={[styles.scrollContainer, this.props.style]}>
          {this.renderRows()}
        </ScrollView>
      )
    } else {
      return (
        <View style={[styles.normalContainer, this.props.style]}>
          {this.renderRows()}
        </View>
      )
    }
  }
}
