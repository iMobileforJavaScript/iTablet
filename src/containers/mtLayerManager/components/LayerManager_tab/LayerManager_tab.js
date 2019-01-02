/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { BtnOne, ListSeparator } from '../../../../components/index'

import styles from './styles'

export default class LayerManager_tab extends React.Component {
  static propTypes = {
    mapChange: PropTypes.func,
    showSaveDialog: PropTypes.func,
    addDataset: PropTypes.func,
    addLayerGroup: PropTypes.func,
  }

  _map_change = () => {
    if (typeof this.props.mapChange === 'function') {
      this.props.mapChange()
    }
  }

  _map_save = () => {
    if (typeof this.props.showSaveDialog === 'function') {
      this.props.showSaveDialog(true)
    }
  }

  _add_layer_group = () => {
    if (typeof this.props.addLayerGroup === 'function') {
      this.props.addLayerGroup()
    }
  }

  _add_dataset = () => {
    if (typeof this.props.addDataset === 'function') {
      this.props.addDataset()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="添加图层"
          image={require('../../../../assets/map/icon-add-datasets.png')}
          onPress={this._add_dataset}
        />
        <ListSeparator key={1} mode={ListSeparator.mode.VERTICAL} />
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="保存"
          image={require('../../../../assets/map/icon-save-color.png')}
          onPress={this._map_save}
        />
        <ListSeparator key={2} mode={ListSeparator.mode.VERTICAL} />
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="新建图层组"
          image={require('../../../../assets/map/icon-new-layer-group.png')}
          onPress={this._add_layer_group}
        />
        <ListSeparator key={3} mode={ListSeparator.mode.VERTICAL} />
        <BtnOne
          size={BtnOne.SIZE.SMALL}
          title="地图切换"
          image={require('../../../../assets/map/icon-map-change.png')}
          onPress={this._map_change}
        />
      </View>
    )
  }
}
