import * as React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

export default class MapListItem extends React.Component {

  static propTypes = {
    onPress: PropTypes.func,
    data: PropTypes.object,
    map: PropTypes.any,
  }

  action = () => {
    this.props.onPress && this.props.onPress(this.props.data)
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.itemContainer} onPress={this.action}>
        <Text style={styles.title}>{this.props.data.key}</Text>
      </TouchableOpacity>
    )
  }
}