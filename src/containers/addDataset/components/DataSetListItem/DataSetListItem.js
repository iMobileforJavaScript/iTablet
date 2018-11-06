import * as React from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { DatasetType } from 'imobile_for_reactnative'
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

  constructor(props) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  action = () => {
    this.setSelected(!this.state.selected, this.props.onPress)
  }

  setSelected = (isSelect, cb?: () => {}) => {
    let select = isSelect
    if (isSelect === null) {
      select = !this.state.selected
    }
    this.setState(
      {
        selected: select,
      },
      () => {
        cb && cb(this.props.data)
      },
    )
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
        image = require('../../../../assets/map/icon-polygon.png')
        break
      case DatasetType.IMAGE:
        image = require('../../../../assets/map/icon-surface.png')
        break
      case DatasetType.Network:
        image = require('../../../../assets/map/icon-network.png')
        break
      default:
        image = require('../../../../assets/map/icon-surface.png')
        break
    }
    return image
  }

  renderRadioBtn = () => {
    let viewStyle = styles.radioView,
      dotStyle = styles.radioSelected
    if (this.props.data.isAdd) {
      viewStyle = styles.radioViewGray
      dotStyle = styles.radioSelectedGray
    }
    return (
      <View style={viewStyle}>
        {(this.state.selected || this.props.data.isAdd) && (
          <View style={dotStyle} />
        )}
      </View>
    )
  }

  render() {
    return this.props.hidden ? (
      <View />
    ) : (
      <TouchableOpacity
        disable={this.props.data.isAdd}
        activeOpacity={0.8}
        style={[
          styles.container,
          this.props.height && { height: this.props.height },
        ]}
        onPress={this.action}
      >
        {this.renderRadioBtn()}
        <Image style={styles.image} source={this.getImage()} />
        <Text style={styles.title}>{this.props.data.name}</Text>
      </TouchableOpacity>
    )
  }
}
