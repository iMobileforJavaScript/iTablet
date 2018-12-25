import React, { Component } from 'react'
import { color } from '../../styles'
import { View, Text, Switch } from 'react-native'
import styles from './styles'
export default class MapSetting extends Component {
  props: {
    data: Array,
    onPress: () => {},
    mapSetting: any,
    index: number,
  }

  _onValueChange = (value, item, index) => {
    this.props.onPress && this.props.onPress({ value, item, index })
  }

  render() {
    if (this.props.data.isShow) {
      if (typeof this.props.data.value === 'boolean') {
        return (
          <View style={styles.row}>
            <Text style={styles.itemName}>{this.props.data.name}</Text>
            <Switch
              style={styles.switch}
              trackColor={{
                false: color.reverseTheme,
                true: color.reverseTheme,
              }}
              thumbColor={color.theme}
              ios_backgroundColor={
                this.props.data.value ? color.theme : color.border
              }
              value={this.props.data.value}
              onValueChange={value => {
                this._onValueChange(value, this.props.data, this.props.index)
              }}
            />
          </View>
        )
      } else {
        return (
          <View style={styles.row}>
            <Text style={styles.itemName}>{this.props.data.name}</Text>
            <Text style={styles.itemValue}>{this.props.data.value}</Text>
          </View>
        )
      }
    } else {
      return <View />
    }
  }
}
