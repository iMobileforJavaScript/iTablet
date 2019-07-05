/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { Container, PopModal } from '../../../components'
import { ColorTable, SelectList, FilterList } from './components'
import LinkageList from '../../../components/LinkageList'
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
  copyCoordinate,
  transfer3ParamsSetting,
  transfer7ParamsSetting,
  // advancedSettings,
  fourRanges,
  colorMode,
  transferData,
  coordMenuData,
  coordMenuTitle,
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
import FileTools from '../../../native/FileTools'

export default class SecondMapSettings extends Component {
  props: {
    language: string,
    navigation: Object,
    title: string,
    mapScaleView: Boolean,
    setMapScaleView: () => {},
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
      editControllerVisible: false,
      currentClick: '',
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
    let data = [],
      dataSourceAndSets,
      colorData = null,
      colorModeData = null,
      homeDirectory
    switch (this.state.title) {
      case getLanguage(GLOBAL.language).Map_Settings.BASIC_SETTING:
        data = await this.getBasicData()
        colorData = mapBackGroundColor
        colorModeData = colorMode()
        break
      case getLanguage(GLOBAL.language).Map_Settings.RANGE_SETTING:
        data = await this.getRangeData()
        break
      case getLanguage(GLOBAL.language).Map_Settings.COORDINATE_SYSTEM_SETTING:
        data = await this.getCoordinateSystemData()
        break
      case getLanguage(GLOBAL.language).Map_Settings.ADVANCED_SETTING:
        data = await this.getAdvanceData()
        break
      case getLanguage(GLOBAL.language).Map_Settings.MAP_CENTER:
        data = { title: 'centerPoint' }
        data.value = await SMap.getMapCenter()
        break
      case getLanguage(GLOBAL.language).Map_Settings.MAP_SCALE:
        data = { title: 'scale' }
        data.value = await SMap.getMapScale()
        break
      case getLanguage(GLOBAL.language).Map_Settings.COORDINATE_SYSTEM:
        data = await coordinateData()
        break
      case getLanguage(GLOBAL.language).Map_Settings.CURRENT_VIEW_BOUNDS:
        data = await this.getFourRangeData()
        break
      case getLanguage(GLOBAL.language).Map_Settings.TRANSFER_METHOD:
        data = transferData()
        break
      case getLanguage(GLOBAL.language).Map_Settings.COPY_COORDINATE_SYSTEM:
        data = copyCoordinate()
        break
      case getLanguage(GLOBAL.language).Map_Settings.FROM_DATASOURCE:
        data = await this.getDatasources()
        break
      case getLanguage(GLOBAL.language).Map_Settings.FROM_DATASET:
        data = await this.getDatasources()
        dataSourceAndSets = await this.getDatasets({ data })
        break
      case getLanguage(GLOBAL.language).Map_Settings.FROM_FILE:
        homeDirectory = await FileTools.getHomeDirectory()
        Platform.OS === 'android' && (homeDirectory += '/iTablet')
        data = await FileTools.getPathListByFilterDeep(
          homeDirectory,
          //todo 目前接口只支持xml/prj文件导入
          //"shp,prj,mif,tab,tif,img,sit,xml"
          'xml,prj',
        )
        break
      case 'Geocentric Transalation(3-para)':
        data = transfer3ParamsSetting()
        data[0].value[0].value = this.state.title
        break
      case 'Molodensky(7-para)':
      case 'Abridged Molodensky(7-para)':
      case 'Position Vector(7-para)':
      case 'Coordinate Frame(7-para)':
      case 'Bursa-wolf(7-para)':
        data = transfer7ParamsSetting()
        data[0].value[0].value = this.state.title
        break
    }
    this.setState({
      data,
      colorData,
      colorModeData,
      dataSourceAndSets,
    })
  }

  // 获取数据源
  getDatasources = async () => {
    let datas = []
    let datasources = await SMap.getDatasources()
    datasources.map(item => {
      let obj = {}
      obj.title = item.alias
      obj.server = item.server
      obj.engineType = item.engineType
      obj.iconType = 'text'
      datas.push(obj)
    })
    return datas
  }

  // 获取所有数据集
  getDatasets = async ({ data }) => {
    let result = data
    let index = 0
    let dataset
    for (let item of data) {
      let datasets = []
      dataset = await SMap.getDatasetsByDatasource(
        {
          server: item.server,
          engineType: item.engineType,
          alias: item.title,
        },
        false,
      )
      dataset.list.map(val => {
        let obj = {}
        obj.title = val.datasetName
        obj.parentTitle = val.datasourceName
        datasets.push(obj)
      })
      result[index++].data = datasets
    }
    return result
  }

  // 基础设置数据
  getBasicData = async () => {
    let data, angle, bgColor
    data = await basicSettings()

    data[0].value = await SMap.getMapName()
    data[1].value = this.props.mapScaleView
    data[2].value = await SMap.isEnableRotateTouch()
    data[3].value = await SMap.isEnableSlantTouch()
    angle = await SMap.getMapAngle()
    Platform.OS === 'android' && (angle += '°')
    data[4].value = angle.toString().replace('.0', '')
    //原生层返回的是中文，做一个映射，转换成对应语言
    let colorMode = await SMap.getMapColorMode()
    let allColorMode = {
      默认色彩模式: getLanguage(GLOBAL.language).Map_Settings
        .DEFAULT_COLOR_MODE,
      DEFAULT: getLanguage(GLOBAL.language).Map_Settings.DEFAULT_COLOR_MODE,
      黑白模式: getLanguage(GLOBAL.language).Map_Settings.BLACK_AND_WHITE,
      BLACKWHITE: getLanguage(GLOBAL.language).Map_Settings.BLACK_AND_WHITE,
      灰度模式: getLanguage(GLOBAL.language).Map_Settings.GRAY_SCALE_MODE,
      GRAY: getLanguage(GLOBAL.language).Map_Settings.GRAY_SCALE_MODE,
      黑白反色模式: getLanguage(GLOBAL.language).Map_Settings
        .ANTI_BLACK_AND_WHITE,
      BLACK_WHITE_REVERSE: getLanguage(GLOBAL.language).Map_Settings
        .ANTI_BLACK_AND_WHITE,
      '黑白反色，其他颜色不变': getLanguage(GLOBAL.language).Map_Settings
        .ANTI_BLACK_AND_WHITE_2,
      ONLY_BLACK_WHITE_REVERSE: getLanguage(GLOBAL.language).Map_Settings
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
    data[12].value = await SMap.isMagnifierEnabled()
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
    let transferMethod = await SMap.getCoordSysTransMethod()
    data[0].value = await SMap.getPrjCoordSys()
    let isDynamicProjection = await SMap.getMapDynamicProjection()
    data[2].value = isDynamicProjection
    data[3].value = isDynamicProjection
      ? transferMethod
      : getLanguage(GLOBAL.language).Map_Settings.OFF
    this.setState({
      transferMethod,
    })
    return data
  }

  // //高级设置数据
  // getAdvanceData = async () => {
  //   let data = await advancedSettings()
  //   return data
  // }

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

  //返回
  backAction = () => {
    NavigationService.goBack()
  }

  //switch开关事件
  _onValueChange = async ({ value, item, index }) => {
    let data = this.state.data.concat()
    switch (item.title) {
      case getLanguage(GLOBAL.language).Map_Settings.SHOW_SCALE:
        this.props.setMapScaleView(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.ROTATION_GESTURE:
        await SMap.enableRotateTouch(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.PITCH_GESTURE:
        await SMap.enableSlantTouch(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.MAP_ANTI_ALIASING:
        //IOS接口内写的是int类型的参数 所以转成数字
        if (Platform.OS === 'ios') {
          await SMap.setAntialias(+value)
        } else {
          await SMap.setAntialias(value)
        }
        break
      case getLanguage(GLOBAL.language).Map_Settings.FIX_SYMBOL_ANGLE:
        await SMap.setMarkerFixedAngle(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.FIX_TEXT_ANGLE:
        await SMap.setTextFixedAngle(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.SHOW_OVERLAYS:
        await SMap.setOverlapDisplayed(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.FIX_TEXT_DIRECTION:
        await SMap.setFixedTextOrientation(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.FIX_SCALE_LEVEL:
        await SMap.setVisibleScalesEnabled(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.ENABLE_MAP_MAGNIFER:
        await SMap.setIsMagnifierEnabled(value)
        break
      case getLanguage(GLOBAL.language).Map_Settings.DYNAMIC_PROJECTION:
        await SMap.setMapDynamicProjection(value)
        data[index + 1].value = value
          ? this.state.transferMethod
          : getLanguage(GLOBAL.language).Map_Settings.OFF
    }
    data[index].value = value
    this.setState({
      data,
    })
  }

  //text item 点击事件
  onTextItemPress = async ({ item, title }) => {
    let prjCoordSysName = ''
    let toastTip
    !title && (title = this.state.title)
    switch (title) {
      case getLanguage(GLOBAL.language).Map_Settings.FROM_DATASOURCE:
        prjCoordSysName = await SMap.copyPrjCoordSysFromDatasource(
          item.server,
          item.engineType,
        )
        toastTip = prjCoordSysName
          ? getLanguage(GLOBAL.language).Prompt.COPY_COORD_SYSTEM_SUCCESS
          : getLanguage(GLOBAL.language).Prompt.COPY_COORD_SYSTEM_FAIL
        break
      case getLanguage(GLOBAL.language).Map_Settings.FROM_DATASET:
        prjCoordSysName = await SMap.copyPrjCoordSysFromDataset(
          item.parentTitle,
          item.title,
        )
        toastTip = prjCoordSysName
          ? getLanguage(GLOBAL.language).Prompt.COPY_COORD_SYSTEM_SUCCESS
          : getLanguage(GLOBAL.language).Prompt.COPY_COORD_SYSTEM_FAIL
        break
      case getLanguage(GLOBAL.language).Map_Settings.FROM_FILE:
        prjCoordSysName = await SMap.copyPrjCoordSysFromFile(
          item.path,
          item.name.substring(item.name.lastIndexOf('.'), item.name.length),
        )
        if (prjCoordSysName.error) {
          toastTip = getLanguage(GLOBAL.language).Prompt[prjCoordSysName.error]
        } else {
          toastTip = prjCoordSysName
            ? getLanguage(GLOBAL.language).Prompt.COPY_COORD_SYSTEM_SUCCESS
            : getLanguage(GLOBAL.language).Prompt.COPY_COORD_SYSTEM_FAIL
        }
        break
    }
    toastTip !== undefined && Toast.show(toastTip)
    if (this.state.cb !== '') {
      this.state.cb(prjCoordSysName)
    }
  }

  //arrow item点击事件
  onArrowItemPress = ({ item, index }) => {
    let title = item.title
    let data = this.state.data.concat()
    switch (title) {
      case getLanguage(GLOBAL.language).Map_Settings.ROTATION_ANGLE:
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[index].value.replace('°', ''),
          cb: async value => {
            let isSetSuccess = false
            if (value !== '' && value >= -360 && value <= 360) {
              isSetSuccess = await SMap.setMapAngle(+value)
            } else {
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.ROTATION_ANGLE_ERROR,
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
      case getLanguage(GLOBAL.language).Map_Settings.COLOR_MODE:
      case getLanguage(GLOBAL.language).Map_Settings.BACKGROUND_COLOR:
        if (this.popModal) {
          this.setState(
            {
              currentClick: title,
            },
            () => {
              this.popModal.setVisible(true)
            },
          )
        }
        break
      case getLanguage(GLOBAL.language).Map_Settings.MAP_SCALE:
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
              Toast.show(getLanguage(GLOBAL.language).Prompt.MAP_SCALE_ERROR)
            }
            isSuccess &&
              this.setState({ data }, () => {
                this.backAction()
              })
          },
        })
        break
      case getLanguage(GLOBAL.language).Map_Settings.MAP_CENTER:
        this.props.navigation.navigate('SecondMapSettings', {
          title,
          cb: this.saveInput,
        })
        break
      case getLanguage(GLOBAL.language).Map_Settings.COORDINATE_SYSTEM:
        this.props.navigation.navigate('SecondMapSettings', {
          title,
          cb: this.setMapCoordinate,
        })
        break
      case getLanguage(GLOBAL.language).Map_Settings.CURRENT_VIEW_BOUNDS:
        this.props.navigation.navigate('SecondMapSettings', {
          title,
          rightBtn: getLanguage(GLOBAL.language).Map_Settings.COPY,
        })
        break
      case getLanguage(GLOBAL.language).Map_Settings.COPY_COORDINATE_SYSTEM:
      case getLanguage(GLOBAL.language).Map_Settings.FROM_DATASOURCE:
      case getLanguage(GLOBAL.language).Map_Settings.FROM_DATASET:
      case getLanguage(GLOBAL.language).Map_Settings.FROM_FILE:
        this.props.navigation.navigate('SecondMapSettings', {
          title,
          cb:
            this.state.cb !== ''
              ? this.state.cb
              : ({ prjCoordSysName }) => {
                let data = this.state.data.concat()
                data[0].value = prjCoordSysName
                this.setState({
                  data,
                })
              },
        })
        break
      case getLanguage(GLOBAL.language).Map_Settings.TRANSFER_METHOD:
        this.props.navigation.navigate('SecondMapSettings', {
          title,
          cb: this.setTransferMethod,
        })
        break
      //四至范围点击 跳InputPage
      case getLanguage(GLOBAL.language).Map_Settings.LEFT:
      case getLanguage(GLOBAL.language).Map_Settings.BOTTOM:
      case getLanguage(GLOBAL.language).Map_Settings.RIGHT:
      case getLanguage(GLOBAL.language).Map_Settings.TOP:
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
                  getLanguage(GLOBAL.language).Prompt.VIEW_BOUNDS_RANGE_ERROR,
                )
            } else {
              Toast.show(getLanguage(GLOBAL.language).Prompt.VIEW_BOUNDS_ERROR)
            }
          },
        })
        break
      case 'Geocentric Transalation(3-para)':
      case 'Molodensky(7-para)':
      case 'Abridged Molodensky(7-para)':
      case 'Position Vector(7-para)':
      case 'Coordinate Frame(7-para)':
      case 'Bursa-wolf(7-para)':
        this.props.navigation.navigate('SecondMapSettings', {
          title,
          rightBtn: getLanguage(GLOBAL.language).Map_Settings.CONFIRM,
          cb: this.state.cb,
        })
        break
      //转换参数设置点击
      case '比例差':
      case 'X':
      case 'Y':
      case 'Z':
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          placeholder: data[item.pos].value[index].value + '',
          cb: async newValue => {
            let isSuccess = false
            let regExp = /^\d+(\.\d+)?$/
            let data = this.state.data.concat()
            if (newValue !== '' && newValue.match(regExp)) {
              data[item.pos].value[index].value = this.formatNumberToString(
                newValue,
              )
              isSuccess = true
            } else {
              Toast.show(getLanguage(GLOBAL.language).Prompt.TRANSFER_PARAMS)
            }
            isSuccess &&
              this.setState({ data }, () => {
                this.backAction()
              })
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
      case getLanguage(GLOBAL.language).Map_Settings.MAP_CENTER:
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
          Toast.show(getLanguage(GLOBAL.language).Prompt.MAP_CENTER_ERROR)
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

  //设置转换方法回调
  setTransferMethod = value => {
    let data = this.state.data.concat()
    data[3].value = value
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
      item.title === getLanguage(GLOBAL.language).Map_Settings.BACKGROUND_COLOR
    if (
      item.title ===
        getLanguage(GLOBAL.language).Map_Settings.TRANSFER_METHOD &&
      item.value === getLanguage(GLOBAL.language).Map_Settings.OFF
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
          onPress={() => this.onArrowItemPress({ item, index })}
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
    let hasRightValue = item.value !== undefined
    return (
      <TouchableOpacity
        onPress={() => {
          this.onTextItemPress({ item, title: this.state.title })
        }}
      >
        <View style={styles.row}>
          <Text style={styles.itemName}>{item.title}</Text>
          {hasRightValue && <Text style={styles.rightText}>{item.value}</Text>}
        </View>
        {this.renderLine()}
      </TouchableOpacity>
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
      Toast.show(getLanguage(GLOBAL.language).Prompt.COPY_SUCCESS)
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

  //转换参数设置方法
  setTransferParams = async () => {
    let data = this.state.data
    let isSuccess
    let paramsObject = {}
    switch (data.length) {
      case 2:
        paramsObject.rotateX = 0
        paramsObject.rotateY = 0
        paramsObject.rotateZ = 0
        paramsObject.scaleDifference = 0
        paramsObject.translateX = data[1].value[0].value
        paramsObject.translateY = data[1].value[1].value
        paramsObject.translateZ = data[1].value[2].value
        break
      case 3:
        paramsObject.rotateX = data[1].value[0].value
        paramsObject.rotateY = data[1].value[1].value
        paramsObject.rotateZ = data[1].value[2].value
        paramsObject.scaleDifference = data[0].value[1].value
        paramsObject.translateX = data[2].value[0].value
        paramsObject.translateY = data[2].value[1].value
        paramsObject.translateZ = data[2].value[2].value
        break
    }
    Object.keys(paramsObject).map(key => {
      if (typeof paramsObject[key] === 'string') {
        paramsObject[key] = this.formatStringToNumber(paramsObject[key])
      }
    })
    ;(paramsObject.coordSysTransMethod = this.state.title),
    (isSuccess = await SMap.setCoordSysTransMethodAndParams(paramsObject))
    if (isSuccess) {
      this.state.cb(this.state.title)
      this.backAction()
      Toast.show(getLanguage(GLOBAL.language).Prompt.SETTING_SUCCESS)
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.SETTING_FAILED)
    }
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

  renderPopItem = () => {
    let modal = this.state.currentClick
    switch (modal) {
      case getLanguage(GLOBAL.language).Map_Settings.COLOR_MODE:
        return (
          <SelectList
            modal={this.popModal}
            language={this.props.language}
            data={this.state.colorModeData}
            height={scaleSize(400)}
            device={this.state.device}
            callback={this.setMapColorMode}
          />
        )
      case getLanguage(GLOBAL.language).Map_Settings.BACKGROUND_COLOR:
        return (
          <ColorTable
            language={this.props.language}
            data={this.state.colorData}
            device={this.state.device}
            setColorBlock={this.setColorBlock}
          />
        )
      default:
        return <View />
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
                <Text style={styles.headerRight}>
                  {getLanguage(GLOBAL.language).Prompt.CONFIRM}
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
      getLanguage(GLOBAL.language).Map_Settings.COORDINATE_SYSTEM
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
    if (
      this.state.title ===
      getLanguage(GLOBAL.language).Map_Settings.FROM_DATASET
    ) {
      return (
        <Container
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
          }}
        >
          <LinkageList
            language={this.props.language}
            data={this.state.dataSourceAndSets}
            titles={[
              getLanguage(GLOBAL.language).Map_Settings.DATASOURCES,
              getLanguage(GLOBAL.language).Map_Settings.DATASETS,
            ]}
            onRightPress={this.onTextItemPress}
          />
        </Container>
      )
    }
    if (
      this.state.title === getLanguage(GLOBAL.language).Map_Settings.FROM_FILE
    ) {
      let menuData = coordMenuData()
      let menuTitle = coordMenuTitle()
      return (
        <Container
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
          }}
        >
          <FilterList
            language={this.props.language}
            data={this.state.data}
            menuData={menuData}
            menuTitle={menuTitle}
            onItemPress={this.onTextItemPress}
          />
        </Container>
      )
    }
    if (/^[\w\s-]+(\(\d{1,2}-para\))$/.test(this.state.title)) {
      return (
        <Container
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
            headerRight: [
              <TouchableOpacity
                key={'setTransferParams'}
                onPress={() => {
                  this.setTransferParams()
                }}
              >
                <Text style={styles.headerRight}>{this.state.rightBtn}</Text>
              </TouchableOpacity>,
            ],
          }}
        >
          {this.state.data.map((item, index) => {
            return (
              <View key={item + index}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <FlatList
                  renderItem={this.renderItem}
                  data={item.value}
                  extraData={this.state.data}
                  keyExtractor={(item, index) => item + index}
                />
              </View>
            )
          })}
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
        />
        {this.state.title ===
          getLanguage(GLOBAL.language).Map_Settings.BASIC_SETTING && (
          <PopModal ref={ref => (this.popModal = ref)}>
            {this.renderPopItem()}
          </PopModal>
        )}
      </Container>
    )
  }
}
