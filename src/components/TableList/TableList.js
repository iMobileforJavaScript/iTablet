/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView, View } from 'react-native'
import { screen } from '../../utils'

import styles from './styles'

export default class TableList extends React.Component {
  props: {
    data: Array,
    numColumns?: number,
    style?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    renderCell: () => {},
  }

  static defaultProps = {
    data: [],
    numColumns: 2,
  }

  renderRows = () => {
    let rows = [],
      rowsView = []
    this.props.data.forEach((item, index) => {
      let rowIndex = Math.floor(index / this.props.numColumns)
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
      <View key={'row-' + rowIndex} style={[styles.row]}>
        {row}
      </View>
    )
  }

  renderCell = (item, rowIndex, cellIndex) => {
    if (!this.props.renderCell) throw new Error('Please render cell')
    return (
      <View
        style={{ width: screen.deviceWidth / this.props.numColumns }}
        key={rowIndex + '-' + cellIndex}
      >
        {this.props.renderCell({ item, rowIndex, cellIndex })}
      </View>
    )
  }

  render() {
    return (
      <ScrollView style={[styles.container, this.props.style]}>
        {this.renderRows()}
      </ScrollView>
    )
  }
}
