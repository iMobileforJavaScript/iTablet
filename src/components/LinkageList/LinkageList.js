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
    data: Array, // 左侧一级菜单数据
    secondData: Array, //右侧二级菜单数据
    titles: Array, //左右侧标题
    onLeftPress?: () => {}, //左侧点击
    onRightPress?: () => {}, //右侧点击
    styles?: Object, //样式
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      rightData: [],
    }
    this.styles = this.props.styles
      ? Object.assign(styles, this.props.styles)
      : styles
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let currentDatasource = nextProps.data[this.state.selected].title
    let rightItem = nextProps.secondData.filter(item => {
      return item.datasource.alias === currentDatasource
    })
    this.setState({
      rightData: rightItem[0].list,
    })
  }

  onLeftPress = ({ item, index }) => {
    if (this.props.onLeftPress) return this.props.onLeftPress({ item, index })
    let title = item.title
    let rightItem = this.props.secondData.filter(
      item => item.datasource.alias === title,
    )
    this.setState({
      selected: index,
      rightData: rightItem[0].list,
    })
  }

  onRightPress = async ({ item, index }) => {
    if (this.props.onRightPress) return this.props.onRightPress({ item, index })
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
        <Text style={this.styles.rightItem}>{item.datasetName}</Text>
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
