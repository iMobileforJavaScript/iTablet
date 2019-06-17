/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * description: 二级联动菜单组件
 */

import React from 'react'
import { TouchableOpacity, View, FlatList, Text } from 'react-native'
import { color } from '../../../tabs/Mine/MyService/Styles'
import { scaleSize, setSpText } from '../../../../utils'
export default class LinkageList extends React.Component {
  props: {
    language: String,
    data: Array,
    secondData: Array,
    titles: Array,
    onLeftPress?: () => {},
    onRightPress?: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      rightData: [],
    }
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

  // static getDerivedStateFromProps(nextProps,prevState){
  //   if(nextProps.data && nextProps.data[prevState.selected]){
  //     let currentDatasource = nextProps.data[prevState.selected].title
  //     let rightItem = nextProps.secondData.filter(item=>{
  //       return item.datasource.alias === currentDatasource
  //     })
  //     return {
  //       rightData:rightItem[0].list,
  //     }
  //   }
  //   return null
  // }

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
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: scaleSize(60),
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor:
            this.state.selected === index
              ? color.background
              : '#rgba(240, 240, 240 ,0)',
        }}
        onPress={() => {
          this.onLeftPress({ item, index })
        }}
      >
        <Text
          style={{
            flex: 1,
            marginLeft: scaleSize(40),
            fontSize: setSpText(20),
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderRightItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: scaleSize(60),
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          this.onRightPress({ item, index })
        }}
      >
        <Text
          style={{
            flex: 1,
            marginLeft: scaleSize(40),
            fontSize: setSpText(20),
          }}
        >
          {item.datasetName}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <View
          style={{
            width: '100%',
            height: scaleSize(60),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: color.background,
          }}
        >
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: setSpText(22),
            }}
          >
            {this.props.titles[0]}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: setSpText(22),
            }}
          >
            {this.props.titles[1]}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}
        >
          <FlatList
            renderItem={this.renderLeftItem}
            data={this.props.data}
            extraData={this.state.selected}
            keyExtractor={(item, index) => item + index}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: color.background,
            }}
          >
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
