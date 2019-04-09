/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView, View } from 'react-native'
import { screen } from '../../utils'
import styles from './styles'
export default class TableList extends React.PureComponent {
  props: {
    data: Array,
    numColumns?: number,
    lineSeparator?: number,
    style?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    renderCell: () => {},
    type?: string,
  }

  static defaultProps = {
    data: [],
    numColumns: 2,
    type: 'normal', // normal | scroll
    lineSeparator: 10,
  }

  renderRows = () => {
    // this.getDeviceWidth()
    // console.log(this.props)
    let rows = [],
      rowsView = []
    this.props.data.forEach((item, index) => {
      let column = this.props.numColumns
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
          rowIndex &&
            this.props.lineSeparator >= 0 && {
            marginTop: this.props.lineSeparator,
          },
        ]}
      >
        {row}
      </View>
    )
  }

  renderCell = (item, rowIndex, cellIndex) => {
    if (!this.props.renderCell) throw new Error('Please render cell')
    let column = this.props.numColumns
    return (
      <View
        style={[{ width: screen.deviceWidth / column }, this.props.cellStyle]}
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
