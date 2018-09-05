/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { FlatList } from 'react-native'
import { ListSeparator, Container, EmptyView, LayerItem, Dialog } from '../../components'
import { checkType, Toast } from '../../utils'
import PropTypes from 'prop-types'
import { Action, DatasetType } from 'imobile_for_javascript'

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
    this.isEdit = params.isEdit || false // 选择图层后是否为编辑状态
    this.map = params.map
    this.type = params.type || -1
    this.cb = params.cb
    this.currentItem = {}
  }

  componentDidMount() {
    (async function () {
      let layerNameArr = await this.map.getLayersByType(this.type)
      let arr = []
      for(let i = 0; i < layerNameArr.length; i++) {
        let layer = await this.map.getLayer(layerNameArr[i].index)
        let type = await (await layer.getDataset()).getType()
        if (checkType.isVectorDataset(type)) {
          layerNameArr[i].layer = layer
          arr.push(layerNameArr[i])
        }
      }
      this.setState({
        datasourceList: arr,
        showList: true,
      }, () => {
        this.container.setLoading(false)
      })
    }).bind(this)()
  }

  _chooseEditLayer = item =>{
    (async function (){
      // this.container.setLoading(true)
      let layer = item.layer
      this.currentItem = item
      let dataset = await layer.getDataset()
      let datasource = await dataset.getDatasource()
      let datasourceIsReadOnly = await datasource.isReadOnly()
      let datasetIsReadOnly = await dataset.isReadOnly()
      if (datasourceIsReadOnly) {
        Toast.show('该图层所在数据源为只读')
      } else if (datasetIsReadOnly) {
        this.dialog.setDialogVisible(true)
      } else {
        await this.selectLayer()
      }
    }).bind(this)()
  }

  selectLayer = async () => {
    if (!this.currentItem.layer) return
    this.container.setLoading(true)
    let layer = this.currentItem.layer
    if (this.type === -1) {
      this.type = await (await layer.getDataset()).getType()
    }
    await layer.setSelectable(true)
    this.isEdit && await layer.setEditable(true)
    this.currentItem.isEditable = await layer.getEditable()
    await this.mapControl.setAction(Action.SELECT)
    this.props.setEditLayer(this.currentItem)
    this.container.setLoading(false)
    this.props.navigation.goBack()
    this.cb && this.cb(true, this.type)
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
        <Dialog
          ref={ref => this.dialog = ref}
          type={Dialog.Type.MODAL}
          title={'提示'}
          info={'该图层为只读图层，是否设置为可编辑图层?'}
          confirmAction={async () => {
            await (await this.currentItem.getDataset()).setReadOnly(false) // 设置数据集为独占
            this.selectLayer()
          }}/>
      </Container>
    )
  }
}