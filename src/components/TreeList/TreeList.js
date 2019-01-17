/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView } from 'react-native'
import TreeListItem from './TreeListItem'

import styles from './styles'

export default class TreeList extends React.Component {
  props: {
    data: Array,
    numColumns?: number,
    itemTextColor?: string,
    itemTextSize?: number,
    separator?: boolean,
    separatorStyle?: any,
    style?: Object,
    cellStyle?: Object,
    rowStyle?: Object,
    iconStyle?: Object,
    renderItem: () => {},
    renderChild: () => {},
    onPress: () => {},
  }

  static defaultProps = {
    data: [],
    numColumns: 2,
  }

  _onPress = ({ data, index }) => {
    if (this.props.onPress) {
      this.props.onPress({ data, index })
    }
  }

  renderRows = () => {
    let rows = []
    this.props.data.forEach((data, index) => {
      rows.push(this.renderRow({ data, index }))
    })
    return rows
  }

  renderRow = ({ data, index }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ data, index })
    }
    return (
      <TreeListItem
        data={data}
        index={index}
        key={'row-' + index}
        style={[styles.row]}
        textColor={this.props.itemTextColor}
        textSize={this.props.itemTextSize}
        separatorStyle={this.props.separatorStyle}
        separator={this.props.separator}
        childrenStyle={[styles.children]}
        // childrenData={row.childGroups}
        keyExtractor={data => data.path}
        renderChild={this.renderChild}
        onPress={this._onPress}
      />
    )
  }

  renderChild = ({ data, index }) => {
    if (this.props.renderItem) {
      return this.props.renderChild({ data, index })
    }
    return (
      <TreeListItem
        data={data}
        index={index}
        key={'row-' + (data.path || (data.$ && data.$.name) || index)}
        style={[styles.row]}
        textColor={this.props.itemTextColor}
        textSize={this.props.itemTextSize}
        separatorStyle={this.props.separatorStyle}
        separator={this.props.separator}
        childrenStyle={[styles.children]}
        iconStyle={this.props.iconStyle}
        // childrenData={item.childGroups}
        keyExtractor={data => data.path || (data.$ && data.$.name) || index}
        renderChild={this.renderChild}
        onPress={this._onPress}
      />
    )
  }

  renderItem = (row, rowIndex) => {
    this.props.renderItem && this.props.renderItem(row, rowIndex)
  }

  render() {
    return (
      <ScrollView style={[styles.container, this.props.style]}>
        {this.renderRows()}
      </ScrollView>
    )
  }
}
