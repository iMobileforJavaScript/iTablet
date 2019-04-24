/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { Text, TouchableOpacity, Image, View } from 'react-native'
import PropTypes from 'prop-types'
import { DatasetType } from 'imobile_for_reactnative'
import { getLayerIconByType } from '../../assets'

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

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // ;(async function () {
    //   this.layer = await this.props.map.getLayer(this.props.data.name)
    // }).bind(this)();
  }

  _onPress = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  render() {
    return (
      <TouchableOpacity
        key={this.props.data.id}
        style={[styles.container, this.props.style]}
        onPress={this._onPress}
      >
        <View style={styles.imageView}>
          <Image
            style={[
              styles.image,
              this.props.data.type === DatasetType.POINT && styles.samllImage,
              this.props.imageStyle,
            ]}
            source={getLayerIconByType(this.props.data.type)}
          />
        </View>
        <Text style={[styles.title, this.props.titleStyle]}>
          {this.props.data.name}
        </Text>
      </TouchableOpacity>
    )
  }
}
