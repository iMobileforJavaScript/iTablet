/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { Text, TouchableOpacity, Image, View } from 'react-native'
import PropTypes from 'prop-types'
import { DatasetType } from 'imobile_for_javascript'

import styles from './styles'

export default class LayerItem extends React.Component {

  static propTypes = {
    layer: PropTypes.any,
    map: PropTypes.any,
    data: PropTypes.object,
    onPress: PropTypes.func,
    imageStyle: PropTypes.any,
    titleStyle: PropTypes.any,
    style: PropTypes.any,
  }

  constructor(props){
    super(props)
  }

  componentDidMount() {
    // ;(async function () {
    //   this.layer = await this.props.map.getLayer(this.props.data.name)
    // }).bind(this)();
  }

  getIconByType = type => {
    let icon
    switch (type) {
      case DatasetType.POINT: // 点数据集
        icon = require('../../assets/map/icon-dot.png')
        break
      case DatasetType.LINE: // 线数据集
        icon = require('../../assets/map/icon-line.png')
        break
      case DatasetType.REGION: // 多边形数据集
        icon = require('../../assets/map/icon-polygon.png')
        break
      case DatasetType.TEXT: // 文本数据集
        icon = require('../../assets/map/icon-text.png')
        break
      case DatasetType.IMAGE: // 影像数据集
        icon = require('../../assets/map/icon-surface.png')
        break
      case DatasetType.CAD: // 复合数据集
        icon = require('../../assets/map/icon-cad.png')
        break
      case DatasetType.Network: // 复合数据集
        icon = require('../../assets/map/icon-network.png')
        break
      default:
        icon = require('../../assets/public/mapLoad.png')
        break
    }
    return icon
  }

  _onPress = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  render() {
    return (
      <TouchableOpacity key={this.props.data.id} style={[styles.container, this.props.style]} onPress={this._onPress}>
        <View style={styles.imageView}>
          <Image style={[
            styles.image,
            this.props.data.type === DatasetType.POINT && styles.samllImage,
            this.props.imageStyle]} source={this.getIconByType(this.props.data.type)} />
        </View>
        <Text style={[styles.title, this.props.titleStyle]}>{this.props.data.name}</Text>
      </TouchableOpacity>
    )
  }
}