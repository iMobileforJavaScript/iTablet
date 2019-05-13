/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { Container } from '../../../components'
// import constants from '../../workspace/constants'
// // import NavigationService from '../NavigationService'
// import { MapToolbar } from '../../workspace/components'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Platform,
} from 'react-native'
import {
  basicSettings,
  rangeSettings,
  coordinateSystemSettings,
  advancedSettings,
} from '../settingData'
import NavigationService from '../../NavigationService'
// import styles from './styles'
import { SMap } from 'imobile_for_reactnative'
// import { getLanguage } from '../../../language/index'
// import Toast from "../../../utils/Toast"
import { scaleSize } from '../../../utils'
import color from '../../../styles/color'
import styles from './styles'

export default class secondMapSettings extends Component {
  props: {
    language: string,
    navigation: Object,
    currentMap: Object,
    setMapSetting: () => {},
    mapSetting: any,
    device: Object,
    mapLegend: boolean,
    setMapLegend: () => {},
    title: string,
  }
  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.state = {
      data: '',
      title: params.title,
    }
  }
  UNSAFE_componentWillMount() {
    this.getData()
  }
  getData = async () => {
    let data
    //地图旋转角度
    switch (this.state.title) {
      case '基本设置':
        data = await this.getBasicData()
        break
      case '范围设置':
        data = await this.getRangeData()
        break
      case '坐标系设置':
        data = await this.getCoordinateSystemData()
        break
      case '高级设置':
        data = await this.getAdvanceData()
        break
      case '图例设置':
    }
    this.setState({
      data,
    })
  }
  //todo 安卓缺接口，所以所有的数据获取都判断了平台
  getBasicData = async () => {
    let data
    let angle
    data = await basicSettings()

    if (Platform.OS === 'ios') {
      data[0].value = await SMap.getMapName()
      data[1].value = await SMap.getScaleViewEnable()
      angle = await SMap.getMapAngle()
      data[2].value = angle.toString().replace('.0', '')
      data[3].value = await SMap.getMapColorMode()
      //todo 4背景颜色 6固定符号角度 7固定文本角度 8固定文本方向 待设置
      data[5].value = await SMap.isAntialias()
      data[9].value = await SMap.isOverlapDisplayed()
    }

    return data
  }

  getRangeData = async () => {
    let data = await rangeSettings()
    if (Platform.OS === 'ios') {
      data[0].value = await SMap.getMapCenter()
      data[1].value = await SMap.getMapScale()
      data[1].value = await SMap.getFixedScale()
    }
    return data
  }

  getCoordinateSystemData = async () => {
    let data = await coordinateSystemSettings()
    return data
  }

  getAdvanceData = async () => {
    let data = await advancedSettings()
    return data
  }

  backAction = () => {
    NavigationService.goBack()
  }

  _onValueChange = async ({ value, item, index }) => {
    if (Platform.OS === 'ios') {
      let data = this.state.data.concat()
      switch (item.title) {
        case '显示比例尺':
          await SMap.setScaleViewEnable(value)
          break
        case '地图反走样':
          //已有接口内写的是int类型的参数 所以转成数字
          await SMap.setAntialias(+value)
          break
        case '显示压盖对象':
          await SMap.setOverlapDisplayed(value)
          break
      }
      data[index].value = value
      this.setState({
        data,
      })
    }
  }

  renderSwitchItem = (item, index) => {
    return (
      <View>
        <View style={{ ...styles.row, paddingRight: scaleSize(10) }}>
          <Text style={styles.itemName}>{item.title}</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={item.value ? color.bgW : color.bgW}
            ios_backgroundColor={item.value ? color.switch : color.bgG}
            value={item.value}
            onValueChange={value => {
              this._onValueChange({ value, item, index })
            }}
          />
        </View>
        {this.renderLine()}
      </View>
    )
  }

  renderLine = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 1,
          marginHorizontal: 10,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  renderArrowItem = item => {
    let rightImagePath = require('../../../assets/Mine/mine_my_arrow.png')
    return (
      <View>
        <TouchableOpacity>
          <View onPress={() => this.onItemPress(item.title)} style={styles.row}>
            <Text style={styles.itemName}>{item.title}</Text>
            {item.value !== undefined && (
              <Text style={styles.rightText}>{item.value}</Text>
            )}
            <Image
              style={styles.itemArrow}
              resizeMode={'contain'}
              source={rightImagePath}
            />
          </View>
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    )
  }

  renderTextItem = item => {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.itemName}>{item.title}</Text>
        </View>
        {this.renderLine()}
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    switch (item.iconType) {
      case 'switch':
        return this.renderSwitchItem(item, index)
      case 'arrow':
        return this.renderArrowItem(item)
      case 'text':
        return this.renderTextItem(item)
    }
  }

  render() {
    return (
      <Container
        headerProps={{
          title: this.state.title,
          backAction: this.backAction,
        }}
      >
        <FlatList
          renderItem={this.renderItem}
          data={this.state.data}
          keyExtractor={(item, index) => item + index}
          numColumns={1}
        />
      </Container>
    )
  }
}
