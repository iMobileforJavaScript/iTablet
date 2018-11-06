/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { FlatList } from 'react-native'
import { Container } from '../../components'
import { SScene } from 'imobile_for_reactnative'
import { Layer3DManager_item } from './components'

export default class Map3DLayerManager extends React.Component {
  props: {
    navigation: any,
  }

  constructor(props) {
    super(props)
    const { state } = this.props.navigation
    this.workspace = state.params.workspace
    this.scene = state.params.scene
  }

  componentDidMount() {
    (async function() {
      let layerList = await SScene.getLayerList()
      this.setState({
        datasourceList: layerList,
      })
    }.bind(this)())
  }

  state = {
    datasourceList: '',
  }

  _renderItem = ({ item }) => {
    let name = item.name
    let visible = item.visible
    return <Layer3DManager_item name={name} visible={visible} />
  }

  render() {
    return (
      <Container
        headerProps={{
          title: '图层管理',
          navigation: this.props.navigation,
          headerRight: [],
        }}
      >
        <FlatList
          data={this.state.datasourceList}
          renderItem={this._renderItem}
        />
      </Container>
    )
  }
}
