/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { TouchableOpacity, FlatList, Text } from 'react-native'
import { BtnTwo, Container, UsualInput, ListSeparator } from '../../../components'
import { constUtil, Toast } from '../../../utils'
import NavigationService from '../../NavigationService'

import styles from './styles'

const UNIQUE = '单值专题图'
const RANGE = '分段设色专题图'
const UNIFIED = '标签专题图'

export default class ThemeEntry extends React.Component {

  props: {
    navigation: Object,
  }

  state = {
    data: [{title: UNIQUE}, {title: RANGE}, {title: UNIFIED}],
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.layer = params && params.layer
    this.map = params && params.map
    this.mapControl = params && params.mapControl

    this.state = {
      data: [{title: UNIQUE}, {title: RANGE}, {title: UNIFIED}],
    }
  }

  rowAction = ({title}) => {
    NavigationService.navigate('ThemeEdit', {
      title,
      layer: this.layer,
      map: this.map,
      mapControl: this.mapControl,
    })
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.row}
        onPress={() => this.rowAction(item)}
      >
        <Text style={styles.rowTitle}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  _renderSeparator = ({leadingItem}) => {
    return (
      <ListSeparator key={'separator_' + leadingItem.id}/>
    )
  }

  _keyExtractor = (item, index) => index

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '专题图',
          navigation: this.props.navigation,
        }}>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderSeparator}
        />

      </Container>
    )
  }
}

ThemeEntry.Type = {
  UNIQUE: UNIQUE,
  RANGE: RANGE,
  UNIFIED: UNIFIED,
}