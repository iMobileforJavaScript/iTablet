/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { TouchableOpacity, FlatList, Text } from 'react-native'
import { Container, ListSeparator } from '../../../components'
import { Const } from '../../../constants'
import NavigationService from '../../NavigationService'

import styles from './styles'

export default class ThemeEntry extends React.Component {
  props: {
    navigation: Object,
  }

  state = {
    data: [
      { title: Const.UNIQUE },
      { title: Const.RANGE },
      { title: Const.LABEL },
    ],
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.layer = params && params.layer
    this.map = params && params.map
    this.mapControl = params && params.mapControl

    this.state = {
      data: [
        { title: Const.UNIQUE },
        { title: Const.RANGE },
        { title: Const.LABEL },
      ],
    }
  }

  rowAction = ({ title }) => {
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

  _renderSeparator = ({ leadingItem }) => {
    return <ListSeparator key={'separator_' + leadingItem.id} />
  }

  _keyExtractor = (item, index) => index

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '专题图',
          navigation: this.props.navigation,
        }}
      >
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
