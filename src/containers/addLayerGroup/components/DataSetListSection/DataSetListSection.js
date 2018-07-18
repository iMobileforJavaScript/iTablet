import * as React from 'react'
import { Image, TouchableOpacity, Text } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

export default class DataSetListSection extends React.Component {

  static propTypes = {
    onPress: PropTypes.func,
    data: PropTypes.object,
    height: PropTypes.number,
    isShow: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    // this.state = {
    //   isShow: false,
    // }
  }

  action = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  renderArrow = () => {
    let image = this.props.data.isShow
      ? require('../../../../assets/map/icon-arrow-up.png')
      : require('../../../../assets/map/icon-arrow-down.png')
    return (
      <Image style={styles.image} source={image} />
    )
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, this.props.height && {height: this.props.height}]}
        onPress={this.action}
      >
        {this.renderArrow()}
        <Text style={styles.title}>{this.props.data.key}</Text>
      </TouchableOpacity>
    )
  }
}