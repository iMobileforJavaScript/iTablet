/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView, View } from 'react-native'
import styles from './styles'

export default class TableList extends React.Component {
  props: {
    data: Array,
    numColumns?: number,
    lineSeparator?: number,
    style?: Object,
    cellWidth?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    renderCell: () => {},
    device: Object,
    type?: string,
  }

  static defaultProps = {
    data: [],
    numColumns: 2,
    type: 'normal', // normal | scroll
    lineSeparator: 10,
  }

  constructor(props) {
    super(props)
    this.state = {
      height: 0,
      width: 0,
    }
  }

  _onLayout = event => {
    //获取根View的宽高，以及左上角的坐标值
    let { width, height } = event.nativeEvent.layout
    if (height !== this.state.height || width !== this.state.width) {
      this.setState({
        height,
        width,
      })
    }
  }

  renderRows = () => {
    // this.getDeviceWidth()
    // console.log(this.props)
    let rows = [],
      rowsView = [],
      column = this.props.numColumns
    if (this.props.cellWidth) {
      column = Math.floor(this.state.width / this.props.cellWidth)
    }
    this.props.data.forEach((item, index) => {
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
        style={{ width: this.props.device.width / column }}
        key={rowIndex + '-' + cellIndex}
      >
        {this.props.renderCell({ item, rowIndex, cellIndex })}
      </View>
    )
  }

  render() {
    if (this.props.type === 'scroll') {
      return (
        <ScrollView
          style={[styles.scrollContainer, this.props.style]}
          onLayout={this._onLayout}
        >
          {this.renderRows()}
        </ScrollView>
      )
    } else {
      return (
        <View
          style={[styles.normalContainer, this.props.style]}
          onLayout={this._onLayout}
        >
          {this.renderRows()}
        </View>
      )
    }
  }
}
