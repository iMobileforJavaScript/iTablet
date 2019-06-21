/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * description: 顶部筛选菜单组件
 */

import React from 'react'
import { TouchableOpacity, View, FlatList, Text } from 'react-native'
import { color } from '../../../tabs/Mine/MyService/Styles'
import { scaleSize, setSpText } from '../../../../utils'
export default class FilterList extends React.Component {
  props: {
    language: string,
    data: Array,
    menuTitle: Array,
    menuData: Array,
    onItemPress?: () => {},
  }

  constructor(props) {
    super(props)
    this.typeArray = [
      'shp,prj,mif,tab,tif,img,sit,xml',
      'shp,prj',
      'mif',
      'tab',
      'tif,img,sit',
      'xml',
    ]
    this.state = {
      data: [],
      menuData: [],
      isShowMenu: false,
      activeIndex: -1,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: nextProps.data,
      })
    }
  }
  // static getDerivedStateFromProps(nextProps,prevState){
  //   if(nextProps.data && nextProps.data != prevState.data){
  //     return {
  //       data:nextProps.data,
  //     }
  //   }
  //   return null
  // }

  onTitlePress = index => {
    let isShowMenu = true
    let activeIndex = index
    if (index === this.state.activeIndex) {
      activeIndex = -1
      isShowMenu = false
    }
    let menuData = this.props.menuData[index]
    this.setState({
      activeIndex,
      isShowMenu,
      menuData,
    })
  }

  onItemPress = ({ item, index }) => {
    if (item.name) {
      return this.props.onItemPress({ item })
    } else {
      let surffix = []
      let data = []
      if (this.state.activeIndex === 0) {
        surffix = this.typeArray[index].split(',')
      } else {
        surffix = [item.replace('*.', '')]
      }
      for (let i = 0; i < this.props.data.length; i++) {
        for (let j = 0; j < surffix.length; j++) {
          let regExp = new RegExp(`(${surffix[j]})$`)
          if (this.props.data[i].name.match(regExp)) {
            data.push(this.props.data[i])
          }
        }
      }
      this.setState({
        data,
        activeIndex: -1,
        isShowMenu: false,
      })
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: scaleSize(60),
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          this.onItemPress({ item, index })
        }}
      >
        <Text
          style={{
            flex: 1,
            marginLeft: scaleSize(40),
            fontSize: setSpText(20),
          }}
        >
          {item.name || item}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color.background,
        }}
      >
        <View
          style={{
            width: '100%',
            height: scaleSize(60),
            flexDirection: 'row',
            borderBottomColor: color.gray,
            borderBottomWidth: scaleSize(2),
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              this.onTitlePress(0)
            }}
          >
            <Text
              style={{
                fontSize: setSpText(22),
                color: this.state.activeIndex === 0 ? color.blue1 : color.black,
              }}
            >
              {this.props.menuTitle[0]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              this.onTitlePress(1)
            }}
          >
            <Text
              style={{
                fontSize: setSpText(22),
                color: this.state.activeIndex === 1 ? color.blue1 : color.black,
              }}
            >
              {this.props.menuTitle[1]}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          renderItem={this.renderItem}
          data={this.state.data}
          keyExtractor={(item, index) => item + index}
        />
        {this.state.isShowMenu && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 10,
              left: 0,
              top: scaleSize(60),
              width: '100%',
              height: '100%',
              backgroundColor: color.background,
            }}
            onPress={() => {
              this.setState({
                isShowMenu: false,
                activeIndex: -1,
              })
            }}
          >
            <FlatList
              renderItem={this.renderItem}
              data={this.state.menuData}
              keyExtractor={(item, index) => item + index}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}
