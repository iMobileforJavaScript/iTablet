/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { FlatList, View } from 'react-native'
import { screen } from '../../utils'
import styles from './styles'

export default class GridList extends Component {
  props: {
    columns: number,
    height: number,
    data: Array,
    renderRow?: () => {},
    renderItem?: () => {},
  }

  static defaultProps = {
    columns: 6,
    data: [],
  }

  _renderRow = ({ item, index: row }) => {
    if (this.props.renderRow) {
      return this.props.renderRow()
    } else {
      let rows = []
      item.forEach((item, index) => {
        rows.push(this._rendeItem({item, row, index}))
      })
      return (
        <View style={styles.row} key={'row_' + row}>
          {rows}
        </View>
      )
    }
  }

  _rendeItem = ({item, row, index}) => {
    if (this.props.renderItem) {
      const width = screen.deviceWidth / this.props.columns
      return (
        <View key={row + '_' + index} style={{width: width}}>
          {this.props.renderItem({item, row, index})}
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  _keyExtractor = (item, index) => index

  _renderRowSeparator = () => {
    return <View style={styles.rowSeparator} />
  }

  setNativeProps = props => {
    this.gridList && this.gridList.setNativeProps(props)
  }

  render() {
    return (
      <FlatList
        ref={ref => this.gridList = ref}
        style={[styles.listView, this.props.height >= 0 && {height: this.props.height}]}
        data={this.props.data}
        renderItem={this._renderRow}
        keyExtractor={this._keyExtractor}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={this._renderRowSeparator}
      />
    )
  }
}