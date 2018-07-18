/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, StyleSheet, SectionList } from 'react-native'
import { ListSeparator } from '../../components'
import styles from './styles'

export default class Table extends PureComponent {

  props: {
    style?: StyleSheet,
    headerStyle?: StyleSheet,
    titleStyle?: StyleSheet,
    data: Object,
  }

  static defaultProps = {
  }

  componentDidMount() {
  }

  setLoading = loading => {
    this.loading.setLoading(loading)
  }
  
  _renderSetion = ({ section }) => {
    return (
      <View>
        <View></View>
        <View></View>
      </View>
    )
  }
  
  _renderItem = ({ item }) => {
    return (
      <View>
        <View></View>
        <View></View>
      </View>
    )
  }
  
  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  render() {
    return (
      <SectionList
        renderSectionHeader={this._renderSetion}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        sections={this.state.dataSourceList}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        // SectionSeparatorComponent={this._renderSectionSeparatorComponent}
      />
    )
  }
}
