import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, FlatList } from 'react-native'
import { scaleSize } from '../../../../utils'

const radio_on = require('../../../../assets/public/radio_select.png')
const radio_off = require('../../../../assets/public/radio_select_no.png')

export default class ExportList extends Component {
  props: {
    data: Array,
    selectedItem: any,
    onPress: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      selectedItem: this.props.selectedItem,
    }
  }

  setData = data => {
    this.setState({ data })
  }

  renderItem = type => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: scaleSize(5),
        }}
        activeOpacity={0.9}
        onPress={() => {
          this.setState({ selectedItem: type })
          this.props.onPress(type)
        }}
      >
        <Image
          style={{
            width: scaleSize(30),
            height: scaleSize(30),
            marginRight: scaleSize(10),
          }}
          source={this.state.selectedItem === type ? radio_on : radio_off}
        />
        <Text style={{ fontSize: scaleSize(20), color: '#303030' }}>
          {'*.' + type}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={(item, index) => index.toString()}
        extra={this.state.selectedItem}
      />
    )
  }
}
