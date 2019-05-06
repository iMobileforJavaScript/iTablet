import React, { Component } from 'react'
import { View, Text, Switch } from 'react-native'
import styles from './styles'
import { color } from '../../styles'
export default class MapSetting extends Component {
  props: {
    data: Array,
    onPress: () => {},
    mapSetting: any,
    index: number,
    section: Object,
    device: Object,
  }

  _onValueChange = (value, item, index) => {
    this.props.onPress &&
      this.props.onPress({ value, item, index, section: this.props.section })
  }

  render() {
    if (typeof this.props.data.value === 'boolean') {
      return (
        <View>
          <View style={styles.row}>
            <Text style={styles.itemName}>{this.props.data.name}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={this.props.data.value ? color.bgW : color.bgW}
              ios_backgroundColor={
                this.props.data.value ? color.switch : color.bgG
              }
              value={this.props.data.value}
              onValueChange={value => {
                this._onValueChange(value, this.props.data, this.props.index)
              }}
            />
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <View style={styles.row}>
            <Text style={styles.itemName}>{this.props.data.name}</Text>
            <Text style={styles.itemValue}>{this.props.data.value}</Text>
          </View>
        </View>
      )
    }
  }
}
