/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * 三维裁剪多页菜单，左右点击换页
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Switch,
} from 'react-native'
import styles from './style'
import { scaleSize } from '../../../../utils'
import color from '../../../../styles/color'
import ConstToolType from '../../../../constants/ConstToolType'

export default class MenuList extends Component {
  props: {
    data: Array,
    device: Object,
    clipSetting: Object,
    changeHeight?: () => {}, //box高度change
    dataChangeCall: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      length: props.data ? props.data.length : 0,
      title: (props.data && props.data[0] && props.data[0].title) || '',
      layers: (props.data && props.data[0] && props.data[0].data) || [],
      data: (props.data && props.data[0] && props.data[0].data) || [],
      hiddenPart: false,
      wrapWidth: (props.device && props.device.width) || 0,
      clipSetting: props.clipSetting,
    }
    //函数防抖
    this.startTime = 0
    this.INTERVAL = 400
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.data.length > 0) {
      if (
        JSON.stringify(nextProps.clipSetting) !==
          JSON.stringify(this.state.clipSetting) ||
        JSON.stringify(nextProps.data[this.state.index]) !==
          JSON.stringify(this.state.data)
      ) {
        this.setState({
          data: nextProps.data[this.state.currentIndex].data,
          title: nextProps.data[this.state.currentIndex].title,
          clipSetting: nextProps.clipSetting,
        })
      }
    }
  }
  changeData = type => {
    let data, title
    let currentIndex = this.state.currentIndex
    if (type === 'indexAdd') {
      currentIndex++
    } else {
      currentIndex--
    }
    title = this.props.data[currentIndex].title
    data = this.props.data[currentIndex].data
    this.setState({
      data,
      title,
      currentIndex,
    })
  }

  //获取选中图层
  getlayers = () => {
    return this.state.layers.filter(item => item.isChecked === true)
  }

  componentDidMount() {
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    clipSetting.layers = this.getlayers()
    this.setState({
      clipSetting,
    })
  }
  //改变第一页图层的选中状态
  changeListSelect = (title, index) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let layers = JSON.parse(JSON.stringify(this.state.layers))
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    data[index].isChecked = !data[index].isChecked
    if (title === '裁剪图层') {
      layers[index].isChecked = !layers[index].isChecked
      clipSetting.layers = layers.filter(item => item.isChecked === true)
    }
    this.setState(
      {
        layers,
        data,
        clipSetting,
      },
      () => {
        this.debounce(this.mapcut)
      },
    )
  }

  //toolbar显示/部分隐藏
  changeHeight = () => {
    let hiddenPart = this.state.hiddenPart
    let flag = hiddenPart
      ? ConstToolType.MAP3D_CLIP
      : ConstToolType.MAP3D_CLIP_HIDDEN
    this.props.changeHeight &&
      this.props.changeHeight(this.props.device.orientation, flag)
    this.setState({
      hiddenPart: !hiddenPart,
    })
  }

  //改变input的值
  changeNumber = ({ flag, title, number }) => {
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    let needBigerThanZero = false
    let stepNum = 1
    let needSmallerThan360 = false
    switch (title) {
      case 'x':
      case 'y':
        stepNum = 0.00001
        needSmallerThan360 = true
        needBigerThanZero = true
        break
      case 'z':
        stepNum = 0.5
        needSmallerThan360 = true
        needBigerThanZero = true
        break
      case 'x旋转':
      case 'y旋转':
      case 'z旋转':
        needSmallerThan360 = true
        needBigerThanZero = true
        break
      case '底面长':
      case '底面宽':
      case '高度':
        needBigerThanZero = true
        break
    }
    let key = title
      .replace('旋转', 'Rot')
      .replace('底面长', 'length')
      .replace('底面宽', 'width')
      .replace('高度', 'height')
    if (number !== undefined) {
      if (needBigerThanZero) {
        number = number > 0 ? number : 0
      }
      if (needSmallerThan360) {
        number = number < 360 ? number : 360
      }
      clipSetting[key] = number
    }
    if (flag === 'minus') {
      if ((needBigerThanZero && clipSetting[key] > 0) || !needBigerThanZero) {
        clipSetting[key] -= stepNum
      }
    } else if (flag === 'plus') {
      if (
        (needSmallerThan360 && clipSetting[key] < 360) ||
        !needSmallerThan360
      ) {
        clipSetting[key] += stepNum
      }
    }
    this.setState(
      {
        clipSetting,
      },
      () => {
        if (number !== 0) {
          this.debounce(this.mapcut)
        }
      },
    )
  }

  mapcut = async () => {
    let data = this.state.clipSetting
    data.layers = this.getlayers()
    let clipSetting = await this.props.dataChangeCall(data)
    this.setState({
      clipSetting,
    })
  }

  debounce = fn => {
    if (
      this.state.clipSetting.width === 0 ||
      this.state.clipSetting.height === 0 ||
      this.state.clipSetting.length === 0
    ) {
      return
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(fn, this.INTERVAL)
  }
  changeSwitchValue = ({ value, index }) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let clipSetting = JSON.parse(JSON.stringify(this.state.clipSetting))
    let pos = ~~index
    data[pos].value = value
    if (data[pos].title === '区域内裁剪') clipSetting.clipInner = value
    this.setState(
      {
        data,
        clipSetting,
      },
      () => {
        this.debounce(this.mapcut)
      },
    )
  }

  renderSelectableItem = ({ item, index }) => {
    item = this.state.layers[index]
    let visibleImgBlack = item.isChecked
      ? require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')

    let layerIcon = require('../../../../assets/mapToolbar/Frenchgrey/icon_layer_selected.png')

    switch (item.type) {
      case 'Terrain':
        layerIcon = require('../../../../assets/map/Frenchgrey/icon_vectorfile.png')
        break
    }
    return (
      <View>
        <View style={[styles.row, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity
            onPress={() => {
              this.changeListSelect(this.state.title, index)
            }}
          >
            <Image
              style={{
                width: scaleSize(30),
                height: scaleSize(30),
                tintColor: color.imageColorBlack,
              }}
              source={visibleImgBlack}
            />
          </TouchableOpacity>
          <Image
            style={{
              marginHorizontal: scaleSize(10),
              width: scaleSize(30),
              height: scaleSize(30),
              tintColor: color.imageColorBlack,
            }}
            source={layerIcon}
          />
          <Text>{item.title}</Text>
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderInputItem = ({ item }) => {
    const minus = require('../../../../assets/mapTool/icon_minus.png')
    const plus = require('../../../../assets/mapTool/icon_plus.png')
    return (
      <View>
        <View style={styles.row}>
          <Text style={{ flex: 1 }}>{item.title}</Text>

          <View
            style={{
              width: scaleSize(122),
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={[
                styles.icon,
                {
                  borderRightWidth: 1,
                  borderColor: color.gray,
                  backgroundColor: color.white,
                },
              ]}
              onPress={() => {
                this.changeNumber({ flag: 'minus', title: item.title })
              }}
            >
              <Image style={styles.icon} source={minus} />
            </TouchableOpacity>
            <TextInput
              value={item.value + ''}
              style={{
                textAlign: 'center',
                width: scaleSize(110),
                height: scaleSize(30),
                backgroundColor: color.white,
                ...Platform.select({
                  android: {
                    padding: 0,
                  },
                }),
              }}
              onChangeText={number => {
                this.changeNumber({
                  title: item.title,
                  number: Number.parseFloat(number),
                })
              }}
              keyboardType={'number-pad'}
            />
            <TouchableOpacity
              style={[
                styles.icon,
                {
                  borderLeftWidth: 1,
                  borderColor: color.gray,
                  backgroundColor: color.white,
                },
              ]}
              onPress={() => {
                this.changeNumber({ flag: 'plus', title: item.title })
              }}
            >
              <Image style={styles.icon} source={plus} />
            </TouchableOpacity>
          </View>
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderTextItem = ({ item }) => {
    return (
      <View>
        <View style={styles.row}>
          <Text style={{ flex: 1 }}>{item.title}</Text>
          <View style={{ flex: 1 }}>
            <TextInput
              value={item.value + ''}
              style={{
                textAlign: 'right',
                height: scaleSize(30),
                ...Platform.select({
                  android: {
                    padding: 0,
                  },
                }),
              }}
              keyboardType={'number-pad'}
              onChangeText={number => {
                this.changeNumber({
                  title: item.title,
                  number: Number.parseFloat(number),
                })
              }}
            />
          </View>
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderSwitchItem = ({ item, index }) => {
    return (
      <View>
        <View style={styles.row}>
          <Text>{item.title}</Text>
          <Switch
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={item.value ? color.bgW : color.bgW}
            ios_backgroundColor={item.value ? color.switch : color.bgG}
            value={item.value}
            onValueChange={value => {
              this.changeSwitchValue({ value, index })
            }}
          />
        </View>
        {this.renderLine()}
      </View>
    )
  }
  renderArrowItem = ({ item }) => {
    let arrowIcon = require('../../../../assets/Mine/mine_my_arrow.png')
    return (
      <View>
        <TouchableOpacity onPress={() => {}} style={styles.row}>
          <Text style={{ flex: 1 }}>{item.title}</Text>
          <Image style={styles.icon} source={arrowIcon} />
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    )
  }
  //渲染分割线
  renderLine = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 1,
          marginHorizontal: 20,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }
  renderTitle = () => {
    let backImage = require('../../../../assets/public/icon_map3d_back.png')
    let forwardImage = require('../../../../assets/public/icon_map3d_forward.png')
    return (
      <View
        style={{
          flexDirection: 'column',
          height: scaleSize(82),
          paddingBottom: scaleSize(8),
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            height: scaleSize(40),
            alignItems: 'center',
          }}
          onPress={() => {
            this.changeHeight()
          }}
        >
          <View
            style={{
              marginVertical: scaleSize(8),
              borderColor: color.gray,
              borderTopWidth: scaleSize(2),
              borderBottomWidth: scaleSize(2),
              height: scaleSize(10),
              width: scaleSize(40),
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            height: scaleSize(42),
            paddingHorizontal: scaleSize(10),
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            {this.state.currentIndex > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  this.changeData('indexMinus')
                }}
              >
                <Image
                  style={{
                    width: scaleSize(40),
                    height: scaleSize(40),
                    tintColor: color.imageColorBlack,
                  }}
                  resizeMode={'contain'}
                  source={backImage}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  width: scaleSize(40),
                  height: scaleSize(40),
                  tintColor: color.imageColorBlack,
                }}
              />
            )}
            <Text
              style={{
                marginLeft: scaleSize(20),
              }}
            >
              {this.state.title}
            </Text>
          </View>
          {this.state.currentIndex < this.state.length - 1 ? (
            <TouchableOpacity
              onPress={() => {
                this.changeData('indexAdd')
              }}
            >
              <Image
                style={{
                  width: scaleSize(40),
                  height: scaleSize(40),
                  tintColor: color.imageColorBlack,
                }}
                resizeMode={'contain'}
                source={forwardImage}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: scaleSize(40),
                height: scaleSize(40),
                tintColor: color.imageColorBlack,
              }}
            />
          )}
        </View>
      </View>
    )
  }
  renderItem = ({ item, index }) => {
    let key
    switch (item.title) {
      case 'x':
      case 'y':
      case 'z':
        key = item.title
        break
      case 'z旋转':
        key = 'zRot'
        break
      case '底面长':
        key = 'length'
        break
      case '底面宽':
        key = 'width'
        break
      case '高度':
        key = 'height'
        break
      case '区域内裁剪':
        key = 'clipInner'
        break
    }
    if (key) {
      item.value = this.state.clipSetting[key]
    }
    switch (item.iconType) {
      case 'Arrow':
        return this.renderArrowItem({ item })
      case 'Input':
        return this.renderInputItem({ item })
      case 'Text':
        return this.renderTextItem({ item })
      case 'Switch':
        return this.renderSwitchItem({ item, index })
      case 'Select':
        return this.renderSelectableItem({ item, index })
    }
  }
  render() {
    if (!this.state.data || this.state.data.length === 0) return null
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color.background,
        }}
      >
        {this.renderTitle()}
        <FlatList
          renderItem={this.renderItem}
          data={this.state.data}
          extraData={this.state.clipSetting}
          keyExtractor={(item, index) => item.title + index}
        />
      </View>
    )
  }
}
