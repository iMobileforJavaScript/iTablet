/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { Container } from '../../../components'
import { ColorTable } from './components'
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
  colorMode,
} from '../settingData'
import { SMap } from 'imobile_for_reactnative'
import { scaleSize } from '../../../utils'
import color from '../../../styles/color'
import styles from './styles'
import Toast from '../../../utils/Toast'
import NavigationService from '../../NavigationService'
import { mapBackGroundColor } from '../../../constants'
import SelectList from './components/SelectList'

export default class secondMapSettings extends Component {
  props: {
    language: string,
    navigation: Object,
    title: string,
    renderItem?: () => {},
  }
  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.state = {
      data: '',
      device: params.device,
      title: params.title,
      cb: params.cb || '',
    }
  }
  UNSAFE_componentWillMount() {
    this.getData()
  }
  getData = async () => {
    let data, colorData, colorModeData
    //地图旋转角度
    switch (this.state.title) {
      case '基本设置':
        data = await this.getBasicData()
        colorData = mapBackGroundColor
        colorModeData = colorMode()
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
      case '中心点':
        data = { title: 'centerPoint' }
        data.value = await SMap.getMapCenter()
        break
      case '比例尺':
        data = { title: 'scale' }
        data.value = await SMap.getMapScale()
        break
      case '柱状图风格':
        data = await this.getHistogramData()
        break
    }
    this.setState({
      data,
      colorData,
      colorModeData,
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
    let data, angle, bgColor
    data = await basicSettings()

    if (Platform.OS === 'ios') {
      data[0].value = await SMap.getMapName()
      data[1].value = await SMap.getScaleViewEnable()
      angle = await SMap.getMapAngle()
      data[2].value = angle.toString().replace('.0', '')
      data[3].value = await SMap.getMapColorMode()
      bgColor = await SMap.getMapBackgroundColor()
      data[4].value = bgColor.toUpperCase()
      data[5].value = await SMap.isAntialias()
      data[6].value = await SMap.getMarkerFixedAngle()
      data[7].value = await SMap.getTextFixedAngle()
      data[8].value = await SMap.getFixedTextOrientation()
      data[9].value = await SMap.isOverlapDisplayed()
    }

    return data
  }

  //范围设置数据
  getRangeData = async () => {
    let data = await rangeSettings()
    if (Platform.OS === 'ios') {
      let mapCenter = await SMap.getMapCenter()
      let centerX = this.formatNumber(mapCenter.x)
      let centerY = this.formatNumber(mapCenter.y)
      let mapScale = await SMap.getMapScale()
      let scale = this.formatNumber(mapScale)
      data[0].value = `${centerX}/${centerY}`
      data[1].value = `1:${scale}`
      data[2].value = await SMap.isVisibleScalesEnabled()
    }
    return data
  }

  formatNumber = num => {
    let dotReg = /\./
    let reg = /\.\d+/
    let afterDot = ''
    dotReg.test(num) && (afterDot = num.match(reg)[0])
    return (+num).toLocaleString('en').replace(reg, afterDot)
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
        case '固定文本方向':
          await SMap.setFixedTextOrientation(value)
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
    let data = this.state.data.concat()
    switch (title) {
      case '旋转角度':
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[2].value.replace('°', ''),
          cb: async value => {
            let isSetSuccess = false
            if (value >= -360 && value <= 360) {
              isSetSuccess = await SMap.setMapAngle(+value)
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
      case '颜色模式':
        GLOBAL.colorModeList && GLOBAL.colorModeList.showFullMap()
        break
      case '背景颜色':
        GLOBAL.colortable && GLOBAL.colortable.showFullMap()
        break
      case '比例尺':
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[1].value.replace('1:', ''),
          cb: async newValue => {
            let isSuccess = false
            let regExp = /^\d+(\.\d+)?$/
            let data = this.state.data.concat()
            if (newValue.match(regExp)) {
              isSuccess = await SMap.setMapScale(1 / newValue)
              data[1].value = `1:${this.formatNumber(newValue)}`
            } else {
              Toast.show('比例输入错误!')
            }
            if (isSuccess) {
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
      case '中心点':
      case '柱状图风格':
        this.props.navigation.navigate('secondMapSettings', {
          title,
          cb: this.saveInput,
        })
        break
    }
  }

  //修改值判定 不适用于跳转InputPage的
  saveInput = async (newValue, title) => {
    let isSuccess = false
    let regExp = /^\d+(\.\d+)?$/
    let data = this.state.data.concat()
    switch (title) {
      case '中心点':
        if (newValue.x.match(regExp) && newValue.y.match(regExp)) {
          isSuccess = await SMap.setMapCenter(+newValue.x, +newValue.y)
          data[0].value =
            this.formatNumber(newValue.x) + '/' + this.formatNumber(newValue.y)
        } else {
          Toast.show('坐标点输入错误!')
        }
        break
    }
    if (isSuccess) {
      this.setState({
        data,
      })
    }
  }

  //设置地图背景色回调
  setColorBlock = color => {
    let data = this.state.data.concat()
    data[4].value = color
    this.setState({
      data,
    })
  }

  //设置地图颜色模式回调
  setColorMode = value => {
    let data = this.state.data.concat()
    data[3].value = value
    this.setState({
      data,
    })
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
            {item.value !== undefined && item.title === '背景颜色' && (
              <View style={{ ...styles.colorView }}>
                <Text
                  style={{ ...styles.colorBlock, backgroundColor: item.value }}
                />
              </View>
            )}
            {item.value !== undefined && item.title !== '背景颜色' && (
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

  //渲染带键盘的多行input 单行的直接跳inputPage（需要修改信息的item）
  renderKeybordItem = item => {
    let renderData = {}
    switch (item.title) {
      case 'centerPoint':
        renderData.x = item.value.x
        renderData.y = item.value.y
        break
      case 'scale':
        renderData.textInput = item
    }
    return (
      <View style={styles.inputContainer}>
        {Object.keys(renderData).map((item, index) => {
          return (
            <TextInput
              key={item + index}
              onChangeText={text => (this[item] = text)}
              style={styles.inputItem}
              placeholder={`${item}:${renderData[item]}`}
            />
          )
        })}
      </View>
    )
  }

  renderColorTable = data => {
    return (
      <ColorTable
        ref={ref => (GLOBAL.colortable = ref)}
        setColorBlock={this.setColorBlock}
        language={this.props.language}
        device={this.state.device}
        data={data}
      />
    )
  }

  renderColorModeList = data => {
    return (
      <SelectList
        ref={ref => (GLOBAL.colorModeList = ref)}
        callback={this.setColorMode}
        language={this.props.language}
        device={this.state.device}
        height={scaleSize(400)}
        data={data}
      />
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
    if (
      this.state.data.constructor === Object &&
      this.state.data.value !== ''
    ) {
      let data = this.state.data
      return (
        <Container
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
            headerRight: [
              <TouchableOpacity
                key={'save'}
                onPress={() => {
                  let value = this.x ? { x: this.x, y: this.y } : this.textInput
                  this.state.cb(value, this.state.title)
                }}
              >
                <Text style={styles.headerRight}>保存</Text>
              </TouchableOpacity>,
            ],
          }}
        >
          {this.renderKeybordItem(data)}
        </Container>
      )
    }
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
        {this.state.title === '基本设置' &&
          this.renderColorTable(this.state.colorData) &&
          this.renderColorModeList(this.state.colorModeData)}
      </Container>
    )
  }
}
