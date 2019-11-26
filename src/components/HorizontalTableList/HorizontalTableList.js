/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { ScrollView, View } from 'react-native'
import styles from './styles'

export default class HorizontalTableList extends React.Component {
  props: {
    data: Array,
    numColumns?: number,
    lineSeparator?: number,
    style?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    renderCell: () => {},
    device: Object,
    Heighttype?: string,
  }

  static defaultProps = {
    data: [],
    numColumns: 4,
    lineSeparator: 10,
  }

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
    }
  }

  renderRows = () => {
    let rows = [],
      rowsView = []
    this.props.data.forEach((item, index) => {
      let rowIndex = 0
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
        style={{ width: this.props.device.width / column }}
        key={rowIndex + '-' + cellIndex}
      >
        {this.props.renderCell({ item, rowIndex, cellIndex })}
      </View>
    )
  }

  render() {
    return (
      <ScrollView
        style={[styles.scrollContainer, this.props.style]}
        horizontal={true}
      >
        {this.renderRows()}
      </ScrollView>
    )
  }
}
