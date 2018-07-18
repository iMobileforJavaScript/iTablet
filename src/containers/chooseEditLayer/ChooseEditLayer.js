/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { FlatList } from 'react-native'
import { ListSeparator, Container, EmptyView, LayerItem } from '../../components'
import PropTypes from 'prop-types'
import { Action } from 'imobile_for_javascript'

export default class ChooseEditLayer extends React.Component {

  static propTypes = {
    editLayer: PropTypes.object,
    navigation: PropTypes.object,
    setEditLayer: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      datasourceList: '',
      showList: false,
    }
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.isEdit = params.isEdit || false
    this.map = params.map
    this.type = params.type || 1
  }

  componentDidMount() {
    (async function () {
      let layerNameArr = await this.map.getLayersByType(this.type)
      for(let i = 0; i < layerNameArr.length; i++) {
        let layer = await this.map.getLayer(layerNameArr[i].index)
        layerNameArr[i].layer = layer
      }
      this.setState({
        datasourceList: layerNameArr,
        showList: true,
      }, () => {
        this.container.setLoading(false)
      })
    }).bind(this)()
  }

  _chooseEditLayer = item =>{
    (async function (){
      let layer = await this.map.getLayer(item.index)
      await layer.setSelectable(true)
      this.isEdit && await layer.setEditable(true)
      await this.mapControl.setAction(Action.SELECT)
      await this.map.refresh()
      this.props.setEditLayer(item)
      this.props.navigation.goBack()
    }).bind(this)()
  }

  _renderItem =  ({item}) => {
    let key = item.id
    return (
      <LayerItem key={key} data={item} map={this.map} onPress={this._chooseEditLayer}/>
    )
  }

  _renderSeparator = ({leadingItem}) => {
    return (
      <ListSeparator key={'separator_' + leadingItem.id}/>
    )
  }

  _keyExtractor = (item, index) => (index + '-' + item.name)

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: '选择编辑图层',
          navigation: this.props.navigation,
        }}>
        {
          this.state.showList && (
            this.state.datasourceList.length > 0
              ? <FlatList
                keyExtractor={this._keyExtractor}
                data={this.state.datasourceList}
                renderItem={this._renderItem}
                ItemSeparatorComponent={this._renderSeparator}
              />
              : <EmptyView />
          )
        }

      </Container>
    )
  }
}