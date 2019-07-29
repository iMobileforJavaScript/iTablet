/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * description: 二级左右联动菜单组件
 */

import React from 'react'
import { TouchableOpacity, View, FlatList, Text } from 'react-native'
import styles from './styles'
export default class LinkageList extends React.Component {
  props: {
    language: String,
    data: Array, // 菜单数据
    titles: Array, //左右侧标题
    onLeftPress?: () => {}, //左侧点击
    onRightPress?: () => {}, //右侧点击
    styles?: Object, //样式
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      // data: props.data || [],
      rightData: (props.data && props.data[0] && props.data[0].data) || [],
    }
    this.styles = this.props.styles
      ? Object.assign(styles, this.props.styles)
      : styles
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        rightData:
          (this.props.data[this.state.selected] &&
            this.props.data[this.state.selected].data) ||
          [],
      })
    }
  }

  onLeftPress = ({ item, index }) => {
    if (this.props.onLeftPress) return this.props.onLeftPress({ item, index })
    this.setState({
      selected: index,
      rightData: item.data,
    })
  }

  onRightPress = async ({ item, index }) => {
    let data = this.props.data
    // let parent = data.filter(val => {
    //   return val.title === item.parentTitle
    // })
    let parent = {}
    for (let p of data) {
      if (p.title === item.parentTitle) {
        parent = p
      }
    }
    if (this.props.onRightPress)
      return this.props.onRightPress({ parent, item, index })
  }

  renderLeftItem = ({ item, index }) => {
    if (this.state.selected === index)
      return (
        <TouchableOpacity
          style={this.styles.leftWrapSelect}
          onPress={() => {
            this.onLeftPress({ item, index })
          }}
        >
          <Text style={this.styles.leftItem}>{item.title}</Text>
        </TouchableOpacity>
      )
    return (
      <TouchableOpacity
        style={this.styles.leftWrap}
        onPress={() => {
          this.onLeftPress({ item, index })
        }}
      >
        <Text style={this.styles.leftItem}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  renderRightItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={this.styles.rightWrap}
        onPress={() => {
          this.onRightPress({ item, index })
        }}
      >
        <Text style={this.styles.rightItem}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.headContainer}>
          <Text style={this.styles.menuTitle}>{this.props.titles[0]}</Text>
          <Text style={this.styles.menuTitle}>{this.props.titles[1]}</Text>
        </View>

        <View style={this.styles.leftFlatListContainer}>
          <FlatList
            renderItem={this.renderLeftItem}
            data={this.props.data}
            extraData={this.state.selected}
            keyExtractor={(item, index) => item + index}
          />

          <View style={this.styles.rightFlatListContainer}>
            <FlatList
              renderItem={this.renderRightItem}
              data={this.state.rightData}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </View>
      </View>
    )
  }
}
