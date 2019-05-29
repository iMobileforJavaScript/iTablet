/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { Container } from '../../../components'
import { ColorTable, SelectList, MaskView } from './components'
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
  Clipboard,
} from 'react-native'
import {
  basicSettings,
  rangeSettings,
  coordinateSystemSettings,
  coordinateData,
  advancedSettings,
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
import { getLanguage } from '../../../language'

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
      showColorTable: false,
      showColorModeMask: false,
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
    dotReg.test(num) && (afterDot = num.toString().match(reg)[0])
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
    switch (this.state.title) {
      case getLanguage(global.language).Map_Settings.BASIC_SETTING:
        data = await this.getBasicData()
        colorData = mapBackGroundColor
        colorModeData = colorMode()
        break
      case getLanguage(global.language).Map_Settings.RANGE_SETTING:
        data = await this.getRangeData()
        break
      case getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM_SETTING:
        data = await this.getCoordinateSystemData()
        break
      case getLanguage(global.language).Map_Settings.ADVANCED_SETTING:
        data = await this.getAdvanceData()
        break
      case getLanguage(global.language).Map_Settings.MAP_CENTER:
        data = { title: 'centerPoint' }
        data.value = await SMap.getMapCenter()
        break
      case getLanguage(global.language).Map_Settings.MAP_SCALE:
        data = { title: 'scale' }
        data.value = await SMap.getMapScale()
        break
      case getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM:
        data = await coordinateData()
        break
      case getLanguage(global.language).Map_Settings.CURRENT_VIEW_BOUNDS:
        data = await this.getFourRangeData()
        break
      case getLanguage(global.language).Map_Settings.TRANSFER_PARAMS:
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

    data[0].value = await SMap.getMapName()
    data[2].value = await SMap.isEnableRotateTouch()
    data[3].value = await SMap.isEnableSlantTouch()
    angle = await SMap.getMapAngle()
    Platform.OS === 'android' && (angle += '°')
    data[4].value = angle.toString().replace('.0', '')
    //原生层返回的是中文，做一个映射，转换成对应语言
    let colorMode = await SMap.getMapColorMode()
    let allColorMode = {
      默认色彩模式: getLanguage(global.language).Map_Settings
        .DEFAULT_COLOR_MODE,
      DEFAULT: getLanguage(global.language).Map_Settings.DEFAULT_COLOR_MODE,
      黑白模式: getLanguage(global.language).Map_Settings.BLACK_AND_WHITE,
      BLACKWHITE: getLanguage(global.language).Map_Settings.BLACK_AND_WHITE,
      灰度模式: getLanguage(global.language).Map_Settings.GRAY_SCALE_MODE,
      GRAY: getLanguage(global.language).Map_Settings.GRAY_SCALE_MODE,
      黑白反色模式: getLanguage(global.language).Map_Settings
        .ANTI_BLACK_AND_WHITE,
      BLACK_WHITE_REVERSE: getLanguage(global.language).Map_Settings
        .ANTI_BLACK_AND_WHITE,
      '黑白反色，其他颜色不变': getLanguage(global.language).Map_Settings
        .ANTI_BLACK_AND_WHITE_2,
      ONLY_BLACK_WHITE_REVERSE: getLanguage(global.language).Map_Settings
        .ANTI_BLACK_AND_WHITE_2,
    }
    data[5].value = allColorMode[colorMode]
    bgColor = await SMap.getMapBackgroundColor()
    data[6].value = bgColor.toUpperCase()
    data[7].value = await SMap.isAntialias()
    data[8].value = await SMap.getMarkerFixedAngle()
    data[9].value = await SMap.getTextFixedAngle()
    data[10].value = await SMap.getFixedTextOrientation()
    data[11].value = await SMap.isOverlapDisplayed()

    if (Platform.OS === 'ios') {
      data[1].value = await SMap.getScaleViewEnable()
    }

    return data
  }

  //范围设置数据
  getRangeData = async () => {
    let data = await rangeSettings()
    let mapCenter = await SMap.getMapCenter()
    let centerX = this.formatNumberToString(mapCenter.x)
    let centerY = this.formatNumberToString(mapCenter.y)
    let mapScale = await SMap.getMapScale()
    let scale = this.formatNumberToString(mapScale)
    data[0].value = `${centerX}/${centerY}`
    data[1].value = `1:${scale}`
    data[2].value = await SMap.isVisibleScalesEnabled()
    return data
  }

  //坐标系设置数据
  getCoordinateSystemData = async () => {
    let data = await coordinateSystemSettings()
    data[0].value = await SMap.getPrjCoordSys()
    let isDynamicProjection = await SMap.getMapDynamicProjection()
    data[1].value = isDynamicProjection
    data[2].value = isDynamicProjection
      ? ''
      : getLanguage(global.language).Map_Settings.OFF
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
  // //获取柱状图风格数据
  // getHistogramData = async () => {
  //   let data = await histogramSettings()
  //   return data
  // }

  //返回
  backAction = () => {
    NavigationService.goBack()
  }

  //switch开关事件
  _onValueChange = async ({ value, item, index }) => {
    let data = this.state.data.concat()
    switch (item.title) {
      case getLanguage(global.language).Map_Settings.SHOW_SCALE:
        await SMap.setScaleViewEnable(value)
        break
      case getLanguage(global.language).Map_Settings.ROTATION_GESTURE:
        await SMap.enableRotateTouch(value)
        break
      case getLanguage(global.language).Map_Settings.PITCH_GESTURE:
        await SMap.enableSlantTouch(value)
        break
      case getLanguage(global.language).Map_Settings.MAP_ANTI_ALIASING:
        //IOS接口内写的是int类型的参数 所以转成数字
        Platform.OS === 'ios' && (value = +value)
        await SMap.setAntialias(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_SYMBOL_ANGLE:
        await SMap.setMarkerFixedAngle(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_TEXT_ANGLE:
        await SMap.setTextFixedAngle(value)
        break
      case getLanguage(global.language).Map_Settings.SHOW_OVERLAYS:
        await SMap.setOverlapDisplayed(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_TEXT_DIRECTION:
        await SMap.setFixedTextOrientation(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_SCALE_LEVEL:
        await SMap.setVisibleScalesEnabled(value)
        break
      case getLanguage(global.language).Map_Settings.DYNAMIC_PROJECTION:
        await SMap.setMapDynamicProjection(value)
        data[index + 1].value = value
          ? ''
          : getLanguage(global.language).Map_Settings.OFF
    }
    data[index].value = value
    this.setState({
      data,
    })
  }

  //arrow item点击事件
  onItemPress = ({ title, index }) => {
    let data = this.state.data.concat()
    switch (title) {
      case getLanguage(global.language).Map_Settings.ROTATION_ANGLE:
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[index].value.replace('°', ''),
          cb: async value => {
            let isSetSuccess = false
            if (value !== '' && value >= -360 && value <= 360) {
              isSetSuccess = await SMap.setMapAngle(+value)
            } else {
              Toast.show(
                getLanguage(global.language).Prompt.ROTATION_ANGLE_ERROR,
              )
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
      case getLanguage(global.language).Map_Settings.COLOR_MODE:
        if (this.colorModeList) {
          this.setState({
            showColorModeMask: true,
          })
          this.colorModeList.showFullMap()
        }
        break
      case getLanguage(global.language).Map_Settings.BACKGROUND_COLOR:
        if (this.colortable) {
          this.setState({
            showColorTable: true,
          })
          this.colortable.showFullMap()
        }
        break
      case getLanguage(global.language).Map_Settings.MAP_SCALE:
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[index].value.replace('1:', ''),
          cb: async newValue => {
            let isSuccess = false
            let regExp = /^\d+(\.\d+)?$/
            let data = this.state.data.concat()
            if (newValue !== '' && newValue.match(regExp)) {
              isSuccess = await SMap.setMapScale(1 / newValue)
              data[index].value = `1:${this.formatNumberToString(newValue)}`
            } else {
              Toast.show(getLanguage(global.language).Prompt.MAP_SCALE_ERROR)
            }
            isSuccess &&
              this.setState({ data }, () => {
                this.backAction()
              })
          },
        })
        break
      case getLanguage(global.language).Map_Settings.MAP_CENTER:
        this.props.navigation.navigate('secondMapSettings', {
          title,
          cb: this.saveInput,
        })
        break
      case getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM:
        this.props.navigation.navigate('secondMapSettings', {
          title,
          cb: this.setMapCoordinate,
        })
        break
      case getLanguage(global.language).Map_Settings.CURRENT_VIEW_BOUNDS:
        this.props.navigation.navigate('secondMapSettings', {
          title,
          rightBtn: getLanguage(global.language).Map_Settings.COPY,
        })
        break
      //todo 暂时不跳转 转换参数页面等设计出图
      case getLanguage(global.language).Map_Settings.TRANSFER_PARAMS:
        // this.props.navigation.navigate('secondMapSettings', {
        //   title,
        // })
        break
      //四至范围点击 跳InputPage
      case getLanguage(global.language).Map_Settings.LEFT:
      case getLanguage(global.language).Map_Settings.BOTTOM:
      case getLanguage(global.language).Map_Settings.RIGHT:
      case getLanguage(global.language).Map_Settings.TOP:
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[index].value,
          cb: async newValue => {
            let isSuccess = false
            let regExp = /^\d+(\.\d+)?$/
            let data = this.state.data.concat()
            if (newValue !== '' && newValue.match(regExp)) {
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
              !isSuccess &&
                Toast.show(
                  getLanguage(global.language).Prompt.VIEW_BOUNDS_RANGE_ERROR,
                )
            } else {
              Toast.show(getLanguage(global.language).Prompt.VIEW_BOUNDS_ERROR)
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
      case getLanguage(global.language).Map_Settings.MAP_CENTER:
        if (
          newValue.x &&
          newValue.x.match(regExp) &&
          newValue.y &&
          newValue.y.match(regExp)
        ) {
          isSuccess = await SMap.setMapCenter(+newValue.x, +newValue.y)
          data[0].value =
            this.formatNumberToString(newValue.x) +
            '/' +
            this.formatNumberToString(newValue.y)
        } else {
          Toast.show(getLanguage(global.language).Prompt.MAP_CENTER_ERROR)
        }
        break
    }
    isSuccess &&
      this.setState({ data }, () => {
        this.backAction()
      })
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
    let hasValue = item.value !== undefined
    let isBackGroundColor =
      item.title === getLanguage(global.language).Map_Settings.BACKGROUND_COLOR
    if (
      item.title ===
        getLanguage(global.language).Map_Settings.TRANSFER_PARAMS &&
      item.value === '关'
    ) {
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
            <Text style={styles.rightText}>{item.value}</Text>
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
            {hasValue && isBackGroundColor && (
              <View style={{ ...styles.colorView }}>
                <Text
                  style={{
                    ...styles.colorBlock,
                    backgroundColor: item.value,
                  }}
                />
              </View>
            )}
            {hasValue && !isBackGroundColor && (
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

  //复制按钮点击事件
  copyInfo = async () => {
    let datas = this.state.data
    Clipboard.setString(
      datas.reduce((total, item) => {
        return `${total}${item.title}:${item.value}\n`
      }, ''),
    )
    let isSuccess = await Clipboard.getString()
    if (isSuccess !== undefined) {
      Toast.show(getLanguage(global.language).Prompt.COPY_SUCCESS)
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
                <Text style={styles.headerRight}>
                  {getLanguage(global.language).Prompt.CONFIRM}
                </Text>
              </TouchableOpacity>,
            ],
          }}
        >
          {this.renderKeybordItem(data)}
        </Container>
      )
    }
    if (
      this.state.title ===
      getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM
    ) {
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
        {this.state.showColorTable && (
          <MaskView
            device={this.state.device}
            callback={() => {
              this.colortable.hideColorList()
              this.setState({
                showColorTable: false,
              })
            }}
          />
        )}
        {this.state.showColorModeMask && (
          <MaskView
            device={this.state.device}
            callback={() => {
              this.colorModeList.hideSelectList()
              this.setState({
                showColorModeMask: false,
              })
            }}
          />
        )}
        {this.state.title ===
          getLanguage(global.language).Map_Settings.BASIC_SETTING &&
          this.renderColorTable(this.state.colorData)}
        {this.state.title ===
          getLanguage(global.language).Map_Settings.BASIC_SETTING &&
          this.renderColorModeList(this.state.colorModeData)}
      </Container>
    )
  }
}
