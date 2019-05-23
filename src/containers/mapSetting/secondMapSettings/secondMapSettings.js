/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { Container } from '../../../components'
import { ColorTable, SelectList } from './components'
import {
  View,
  FlatList,
  SectionList,
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
  coordinateData,
  advancedSettings,
  histogramSettings,
  fourRanges,
  colorMode,
  transferData,
} from '../settingData'
import { SMap } from 'imobile_for_reactnative'
import { scaleSize } from '../../../utils'
import color from '../../../styles/color'
import styles from './styles'
import Toast from '../../../utils/Toast'
import NavigationService from '../../NavigationService'
import { mapBackGroundColor } from '../../../constants'
import { getThemeAssets } from '../../../assets'
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
      data: [],
      device: params.device,
      title: params.title,
      rightBtn: params.rightBtn || '',
      cb: params.cb || '',
    }
  }
  UNSAFE_componentWillMount() {
    this.getData()
  }

  //数字格式化成带逗号的数字
  formatNumberToString = num => {
    let dotReg = /\./
    let reg = /\.\d+/
    let afterDot = ''
    dotReg.test(num) && (afterDot = num.match(reg)[0])
    return (+num).toLocaleString('en').replace(reg, afterDot)
  }

  //带逗号的字符串格式化成数字
  formatStringToNumber = str => {
    let reg = /,/g
    return +str.replace(reg, '')
  }

  //获取数据方法
  getData = async () => {
    let data,
      colorData = null,
      colorModeData = null
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
      case '坐标系':
        data = await coordinateData()
        break
      case '当前窗口四至范围':
        data = await this.getFourRangeData()
        break
      case '转换参数':
        data = await this.getTransferData()
        break
    }
    this.setState({
      data,
      colorData,
      colorModeData,
    })
  }

  //基础设置数据
  getBasicData = async () => {
    let data, angle, bgColor
    data = await basicSettings()

    if (Platform.OS === 'ios') {
      data[0].value = await SMap.getMapName()
      data[1].value = await SMap.getScaleViewEnable()
      data[2].value = await SMap.isEnableRotateTouch()
      data[3].value = await SMap.isEnableSlantTouch()
      angle = await SMap.getMapAngle()
      data[4].value = angle.toString().replace('.0', '')
      data[5].value = await SMap.getMapColorMode()
      bgColor = await SMap.getMapBackgroundColor()
      data[6].value = bgColor.toUpperCase()
      data[7].value = await SMap.isAntialias()
      data[8].value = await SMap.getMarkerFixedAngle()
      data[9].value = await SMap.getTextFixedAngle()
      data[10].value = await SMap.getFixedTextOrientation()
      data[11].value = await SMap.isOverlapDisplayed()
    }

    return data
  }

  //范围设置数据
  getRangeData = async () => {
    let data = await rangeSettings()
    if (Platform.OS === 'ios') {
      let mapCenter = await SMap.getMapCenter()
      let centerX = this.formatNumberToString(mapCenter.x)
      let centerY = this.formatNumberToString(mapCenter.y)
      let mapScale = await SMap.getMapScale()
      let scale = this.formatNumberToString(mapScale)
      data[0].value = `${centerX}/${centerY}`
      data[1].value = `1:${scale}`
      data[2].value = await SMap.isVisibleScalesEnabled()
    }
    return data
  }

  //坐标系设置数据
  getCoordinateSystemData = async () => {
    let data = await coordinateSystemSettings()
    if (Platform.OS === 'ios') {
      data[0].value = await SMap.getPrjCoordSys()
      let isDynamicProjection = await SMap.getMapDynamicProjection()
      data[1].value = isDynamicProjection
      data[2].value = isDynamicProjection ? '' : '关'
    }
    return data
  }

  //转换参数设置数据
  getTransferData = async () => {
    let data = await transferData()
    return data.value
  }
  //高级设置数据
  getAdvanceData = async () => {
    let data = await advancedSettings()
    return data
  }

  //
  getFourRangeData = async () => {
    let data = await fourRanges()
    let viewBounds = await SMap.getMapViewBounds()
    data[0].value = this.formatNumberToString(viewBounds.left)
    data[1].value = this.formatNumberToString(viewBounds.bottom)
    data[2].value = this.formatNumberToString(viewBounds.right)
    data[3].value = this.formatNumberToString(viewBounds.top)
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
        case '手势旋转':
          await SMap.enableRotateTouch(value)
          break
        case '手势俯仰':
          await SMap.enableSlantTouch(value)
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
        case '动态投影':
          await SMap.setMapDynamicProjection(value)
          data[index + 1].value = value ? '' : '关'
      }
      data[index].value = value
      this.setState({
        data,
      })
    }
  }

  //arrow item点击事件
  onItemPress = ({ title, index }) => {
    let data = this.state.data.concat()
    switch (title) {
      case '旋转角度':
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[index].value.replace('°', ''),
          cb: async value => {
            let isSetSuccess = false
            if (value >= -360 && value <= 360) {
              isSetSuccess = await SMap.setMapAngle(+value)
            } else {
              Toast.show('旋转角度范围应为[-360,360]')
            }

            if (isSetSuccess) {
              data[index].value = value + '°'
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
        this.colorModeList && this.colorModeList.showFullMap()
        break
      case '背景颜色':
        this.colortable && this.colortable.showFullMap()
        break
      case '比例尺':
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[index].value.replace('1:', ''),
          cb: async newValue => {
            let isSuccess = false
            let regExp = /^\d+(\.\d+)?$/
            let data = this.state.data.concat()
            if (newValue.match(regExp)) {
              isSuccess = await SMap.setMapScale(1 / newValue)
              data[index].value = `1:${this.formatNumberToString(newValue)}`
            } else {
              Toast.show('比例输入错误!')
            }
            isSuccess &&
              this.setState({ data }, () => {
                this.backAction()
              })
          },
        })
        break
      case '中心点':
        this.props.navigation.navigate('secondMapSettings', {
          title,
          cb: this.saveInput,
        })
        break
      case '坐标系':
        this.props.navigation.navigate('secondMapSettings', {
          title,
          cb: this.setMapCoordinate,
        })
        break
      case '当前窗口四至范围':
        this.props.navigation.navigate('secondMapSettings', {
          title,
          rightBtn: '复制',
        })
        break
      //todo 暂时不跳转 转换参数页面等设计出图
      case '转换参数':
        this.props.navigation.navigate('secondMapSettings', {
          title,
        })
        break
      //四至范围点击 跳InputPage
      case '左':
      case '下':
      case '右':
      case '上':
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[index].value,
          cb: async newValue => {
            let isSuccess = false
            let regExp = /^\d+(\.\d+)?$/
            let data = this.state.data.concat()
            if (newValue.match(regExp)) {
              data[index].value = this.formatNumberToString(newValue)
              let left = this.formatStringToNumber(data[0].value)
              let bottom = this.formatStringToNumber(data[1].value)
              let right = this.formatStringToNumber(data[2].value)
              let top = this.formatStringToNumber(data[3].value)
              isSuccess = await SMap.setMapViewBounds({
                left,
                bottom,
                right,
                top,
              })
              isSuccess &&
                this.setState({ data }, () => {
                  this.backAction()
                })
            } else {
              Toast.show('范围输入错误!')
            }
          },
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
            this.formatNumberToString(newValue.x) +
            '/' +
            this.formatNumberToString(newValue.y)
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
    data[6].value = color
    this.setState({
      data,
    })
  }

  //设置地图颜色模式回调
  setMapColorMode = value => {
    let data = this.state.data.concat()
    data[5].value = value
    this.setState({
      data,
    })
    this.colorModeList.hideSelectList()
  }

  //设置地图坐标系回调
  setMapCoordinate = value => {
    let data = this.state.data.concat()
    data[0].value = value
    this.setState({
      data,
    })
    return true
  }
  //渲染switch
  renderSwitchItem = (item, index) => {
    return (
      <View>
        <View style={{ ...styles.row, paddingRight: scaleSize(10) }}>
          <Text style={styles.itemName}>{item.title}</Text>
          <Switch
            // style={styles.switch}
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
  renderArrowItem = (item, index) => {
    let rightImagePath = require('../../../assets/Mine/mine_my_arrow.png')
    if (item.title === '转换参数' && item.value === '关') {
      return (
        <View>
          <View style={styles.row}>
            <Text
              style={{
                ...styles.itemName,
                color: '#777',
              }}
            >
              {item.title}
            </Text>
            {item.value !== undefined && item.title !== '背景颜色' && (
              <Text style={styles.rightText}>{item.value}</Text>
            )}
            <Image
              style={styles.itemArrow}
              resizeMode={'contain'}
              source={rightImagePath}
            />
          </View>
          {this.renderLine()}
        </View>
      )
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.onItemPress({ title: item.title, index })}
        >
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
        ref={ref => (this.colortable = ref)}
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
        ref={ref => (this.colorModeList = ref)}
        callback={this.setMapColorMode}
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
        return this.renderArrowItem(item, index)
      case 'text':
        return this.renderTextItem(item)
    }
  }

  //SectionList header点击事件
  refreshList = section => {
    let newData = this.state.data
    section.visible = !section.visible
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  //SectionList的header
  renderSectionHeader = ({ section }) => {
    let image = section.visible
      ? getThemeAssets().publicAssets.list_section_packup
      : getThemeAssets().publicAssets.list_section_spread
    return (
      <TouchableOpacity
        style={{
          height: scaleSize(80),
          backgroundColor: color.content,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Image
          source={image}
          style={{
            width: scaleSize(40),
            height: scaleSize(40),
            marginLeft: scaleSize(20),
          }}
        />
        <Text style={styles.sectionHeader}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  //sectionlist的item
  renderSectionItem = ({ item, section }) => {
    if (section.visible) {
      return (
        <View>
          <TouchableOpacity
            onPress={async () => {
              let isSuccess = await SMap.setPrjCoordSys(item.value)
              isSuccess && this.state.cb(item.name) && this.backAction()
            }}
          >
            <View style={styles.row}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return <View />
  }

  //section 分割线
  renderSectionFooter = ({ section }) => {
    if (!section.visible) return <View />
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: 1,
          backgroundColor: color.bgG,
        }}
      />
    )
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
    if (this.state.title === '坐标系') {
      return (
        <Container
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
          }}
        >
          <SectionList
            sections={this.state.data}
            keyExtractor={(item, index) => item + index}
            renderItem={this.renderSectionItem}
            ItemSeparatorComponent={this.renderSectionFooter}
            renderSectionHeader={this.renderSectionHeader}
            renderSectionFooter={this.renderSectionFooter}
          />
        </Container>
      )
    }
    return (
      <Container
        headerProps={{
          title: this.state.title,
          backAction: this.backAction,
          headerRight:
            this.state.rightBtn !== ''
              ? [
                <TouchableOpacity key={'copy'} onPress={this.copyInfo}>
                  <Text style={styles.headerRight}>
                    {this.state.rightBtn}
                  </Text>
                </TouchableOpacity>,
              ]
              : null,
        }}
      >
        <FlatList
          renderItem={this.renderItem}
          data={this.state.data}
          keyExtractor={(item, index) => item + index}
          numColumns={1}
        />
        {this.state.title === '基本设置' &&
          this.renderColorTable(this.state.colorData)}
        {this.state.title === '基本设置' &&
          this.renderColorModeList(this.state.colorModeData)}
      </Container>
    )
  }
}
