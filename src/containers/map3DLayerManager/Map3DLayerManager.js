/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { FlatList } from 'react-native'
import { Container } from '../../components'

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
      let layers3ds = await this.scene.getLayer3Ds()
      let layerCount = await layers3ds.getCount()
      let layerNameArr = []
      for (let i = 0; i < layerCount; i++) {
        let layer = await layers3ds.get(i)
        let name = await layer.getName()
        let scene = this.scene
        layerNameArr.push({ key: name, obj: layer, scene: scene })
      }
      this.setState({
        datasourceList: layerNameArr,
      })
    }.bind(this)())
  }

  state = {
    datasourceList: '',
  }

  _renderItem = ({ item }) => {
    let key = item.key
    let layer = item.obj
    let scene = item.scene
    return <Layer3DManager_item layer={layer} name={key} scene={scene} />
  }

  render() {
    return (
      <Container
        headerProps={{
          title: '地图管理',
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
