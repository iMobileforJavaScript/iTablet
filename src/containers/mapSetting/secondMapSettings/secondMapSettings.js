/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { Container } from '../../../components'
// import constants from '../../workspace/constants'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Platform,
  TextInput,
} from 'react-native'
import {
  basicSettings,
  rangeSettings,
  coordinateSystemSettings,
  advancedSettings,
  histogramSettings,
} from '../settingData'
import NavigationService from '../../NavigationService'
import { SMap } from 'imobile_for_reactnative'
// import { getLanguage } from '../../../language/index'
import { scaleSize } from '../../../utils'
import color from '../../../styles/color'
import styles from './styles'
import Toast from '../../../utils/Toast'

export default class secondMapSettings extends Component {
  props: {
    navigation: Object,
    title: string,
    renderItem?: () => {},
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
        break
      case '柱状图风格':
        data = await this.getHistogramData()
        break
    }
    this.setState({
      data,
    })
  }

  // getKeyBoardData = async () =>{
  //   let data = await getKeyBoard()
  //   switch(this.state.title){
  //     case '旋转角度':
  //       data[0].value = await SMap.getMapAngle()
  //   }
  //   return data
  // }
  //基础设置数据
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
      //todo 4背景颜色 8固定文本方向 待设置
      data[5].value = await SMap.isAntialias()
      data[6].value = await SMap.getMarkerFixedAngle()
      data[7].value = await SMap.getTextFixedAngle()
      data[9].value = await SMap.isOverlapDisplayed()
    }

    return data
  }

  //范围设置数据
  getRangeData = async () => {
    let data = await rangeSettings()
    if (Platform.OS === 'ios') {
      let mapCenter = await SMap.getMapCenter()
      let mapScale = await SMap.getMapScale()
      data[0].value = mapCenter.toLocaleString('en')
      data[1].value = `1:${mapScale.toLocaleString('en')}`
      data[2].value = await SMap.isVisibleScalesEnabled()
    }
    return data
  }

  //坐标系设置数据
  getCoordinateSystemData = async () => {
    let data = await coordinateSystemSettings()
    if (Platform.OS === 'ios') {
      data[0].value = await SMap.getPrjCoordSys()
      //todo 动态投影是否开启 缺少底层接口 data[1] data[2]相关设置
    }
    return data
  }

  //高级设置数据
  getAdvanceData = async () => {
    let data = await advancedSettings()
    return data
  }

  //获取柱状图风格数据
  getHistogramData = async () => {
    let data = await histogramSettings()
    return data
  }
  //返回
  backAction = () => {
    NavigationService.goBack()
  }

  //switch开关事件
  _onValueChange = async ({ value, item, index }) => {
    let data = this.state.data.concat()
    if (Platform.OS === 'ios') {
      switch (item.title) {
        case '显示比例尺':
          await SMap.setScaleViewEnable(value)
          break
        case '地图反走样':
          //已有接口内写的是int类型的参数 所以转成数字
          await SMap.setAntialias(+value)
          break
        case '固定符号角度':
          await SMap.setMarkerFixedAngle(value)
          break
        case '固定文本角度':
          await SMap.setTextFixedAngle(value)
          break
        case '显示压盖对象':
          await SMap.setOverlapDisplayed(value)
          break
        case '固定比例尺级别':
          await SMap.setVisibleScalesEnabled(value)
          break
      }
      data[index].value = value
      this.setState({
        data,
      })
    }
  }

  onItemPress = title => {
    let data
    switch (title) {
      case '旋转角度':
        data = this.state.data.concat()
        NavigationService.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[2].value.replace('°', ''),
          cb: async value => {
            let isSetSuccess = false
            if (value >= -360 && value <= 360) {
              isSetSuccess = await SMap.setMapAngle(~~value)
            } else {
              Toast.show('旋转角度范围应为[-360,360]')
            }

            if (isSetSuccess) {
              data[2].value = value + '°'
              this.setState(
                {
                  data,
                },
                () => {
                  this.backAction()
                },
              )
            }
          },
        })
        break
      case '柱状图风格':
        NavigationService.navigate('secondMapSettings', { title })
        break
    }
  }

  //渲染switch
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

  //渲染分割线
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

  //渲染带more按钮的行
  renderArrowItem = item => {
    let rightImagePath = require('../../../assets/Mine/mine_my_arrow.png')
    return (
      <View>
        <TouchableOpacity onPress={() => this.onItemPress(item.title)}>
          <View style={styles.row}>
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

  //渲染普通text行
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

  //渲染带键盘的input（需要修改信息的item）
  renderKeybordItem = item => {
    return (
      <View>
        <TextInput
          onChangeText={text => (this.currentText = text)}
          style={styles.inputItem}
        >
          {item.value.replace('.0', '').replace('°', '')}
        </TextInput>
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    if (this.props.renderItem) {
      return this.props.renderItem
    }
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
    // if (
    //   Array.isArray(this.state.data) &&
    //   this.state.data[0].iconType === 'keyboard'
    // ) {
    //   let data = this.state.data[0]
    //   return (
    //     <Container
    //       headerProps={{
    //         title: this.state.title,
    //         backAction: this.backAction,
    //         headerRight:
    //           [<TouchableOpacity
    //             key={'save'}
    //             onPress={this.saveInput}
    //           >
    //             <Text style={styles.headerRight}>保存</Text>
    //           </TouchableOpacity>],
    //       }}
    //     >
    //       {this.renderKeybordItem(data)}
    //     </Container>
    //   )
    // }
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
