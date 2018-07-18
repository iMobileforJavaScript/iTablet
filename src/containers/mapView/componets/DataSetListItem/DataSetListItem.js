import * as React from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { DatasetType } from 'imobile_for_javascript'
import PropTypes from 'prop-types'
import styles from './styles'

export default class DataSetListItem extends React.Component {

  static propTypes = {
    onPress: PropTypes.func,
    data: PropTypes.object,
    height: PropTypes.number,
    hidden: PropTypes.bool,
  }

  static defaultProps = {
    hidden: true,
  }

  action = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  getImage = () => {
    let image
    switch (this.props.data.type) {
      case DatasetType.LINE:
        image = require('../../../../assets/map/icon-line.png')
        break
      case DatasetType.POINT:
        image = require('../../../../assets/map/icon-dot.png')
        break
      case DatasetType.REGION:
        image = require('../../../../assets/map/icon-surface.png')
        break
      case DatasetType.IMAGE:
        image = require('../../../../assets/map/icon-surface.png')
        break
      default:
        image = require('../../../../assets/map/icon-surface.png')
        break
    }
    return image
  }

  render() {
    return this.props.hidden ? <View /> : (
      <TouchableOpacity
        disable={this.props.data.isAdd}
        activeOpacity={0.8}
        style={[styles.container, this.props.height && {height: this.props.height}]}
        onPress={this.action}
      >
        <Image style={styles.image} source={this.getImage()} />
        <Text style={styles.title}>{this.props.data.name}</Text>
      </TouchableOpacity>
    )
  }
}