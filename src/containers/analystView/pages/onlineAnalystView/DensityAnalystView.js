import React, { Component } from 'react'
import { Text, View } from 'react-native'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { AnalystItem } from '../../components'
import { DensityParams } from '../../AnalystType'
import styles from './styles'
import onlineParamsData from './onlineParamsData'

export default class OnlineAnalystView extends Component {
  props: {
    language: String,
    navigation: Object,
    device: Object,
    currentUser: Object,
    setModalVisible: () => {},
    clearPopSelected: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      // 分析方法 其中0：简单点密度分析，1：核密度分析
      analystMethod: onlineParamsData.getAnalysisMethod(this.props.language)[0],
      // 网络面类型 其中0：四边形网格，1：六边形网格
      meshType: onlineParamsData.getMeshType(this.props.language)[0],
      // 网格大小单位：Meter(默认),Kilometer,Yard,Foot,Mile
      meshSizeUnit: getLanguage(this.props.language).Analyst_Params.METER,
      weight: '', // 权重 默认1
      bounds: [], // 分析范围：左-下-右-上
      meshSize: 30, // 网格大小（分辨率）
      radius: 300, // 搜索半径
      // SquareMile(默认),SquareMeter,SquareKiloMeter,Hectare,Are,Acre,SquareFoot,SquareYard
      areaUnit: onlineParamsData.getAreaUnit(this.props.language)[0],

      // 专题图分段模式: EQUALINTERVAL(等距离分段)、LOGARITHM(对数分段)、QUANTILE(等计数分段)、
      //               SQUAREROOT(平方根分段)、STDDEVIATION (标准差分段)
      rangeMode: onlineParamsData.getRangeMode(this.props.language)[0],
      // 专题图分段个数
      rangeCount: 0,
      // 专题图颜色渐变模式: GREENORANGEVIOLET(绿橙紫渐变色)、GREENORANGERED(绿橙红渐变)、
      //                   RAINBOW(彩虹色)、SPECTRUM(光谱渐变)、TERRAIN (地形渐变)
      colorGradientType: onlineParamsData.getColorGradientType(
        this.props.language,
      )[0],
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({})
    }
  }

  arrToStr = (arr = []) => {
    let str = ''
    arr.forEach((item, index) => {
      str += item
      if (index < arr.length - 1) {
        str += ','
      }
    })
    return str
  }

  getData = () => {
    return {
      analystMethod: this.state.analystMethod.value,
      meshType: this.state.meshType.value,
      meshSizeUnit: 'Meter',
      weight: this.state.weight.value,
      bounds: this.state.bounds,
      meshSize: this.state.meshSize,
      radius: this.state.radius,
      areaUnit: this.state.areaUnit.value,
      rangeMode: this.state.rangeMode.value,
      rangeCount: this.state.rangeCount,
      colorGradientType: this.state.colorGradientType.value,
    }
  }

  setWeight = weight => {
    weight &&
      JSON.stringify(weight) !== JSON.stringify(this.state.weight) &&
      this.setState({
        weight,
      })
  }

  popCallback = (type, data = {}, cb: () => {}) => {
    let newStateData = {}
    switch (type) {
      case DensityParams.ANALYST_METHOD:
        newStateData = { analystMethod: data }
        break
      case DensityParams.MESH_TYPE:
        newStateData = { meshType: data }
        break
      case DensityParams.WEIGHT: {
        let weightStr = ''
        data.forEach((item, index) => {
          weightStr += item.value
          if (index < data.length - 1) weightStr += ','
        })
        newStateData = { weight: weightStr }
        break
      }
      case DensityParams.RANGE_MODE:
        newStateData = { rangeMode: data }
        break
      case DensityParams.AREA_UNIT:
        newStateData = { areaUnit: data }
        break
      case DensityParams.COLOR_GRADIENT_TYPE:
        newStateData = { colorGradientType: data }
        break
    }
    this.setState(newStateData, () => {
      cb && cb()
    })
  }

  reset = () => {
    this.setState({
      analystMethod: onlineParamsData.getAnalysisMethod(this.props.language)[0],
      meshType: onlineParamsData.getMeshType(this.props.language)[0],
      meshSizeUnit: getLanguage(this.props.language).Analyst_Params.METER,
      weight: '',
      bounds: [],
      meshSize: 30,
      radius: 300,
      areaUnit: onlineParamsData.getAreaUnit(this.props.language)[0],
      rangeMode: onlineParamsData.getRangeMode(this.props.language)[0],
      rangeCount: 0,
      colorGradientType: onlineParamsData.getColorGradientType(
        this.props.language,
      )[0],
    })
  }

  /** 分析参数 **/
  renderAnalystParams = () => {
    return (
      <View key="analystParams" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.ANALYSIS_PARAMS}
          </Text>
        </View>
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.ANALYSIS_METHOD
          }
          value={
            (this.state.analystMethod && this.state.analystMethod.key) || ''
          }
          onPress={async () => {
            this.props.setModalVisible(true, DensityParams.ANALYST_METHOD, {
              popData: onlineParamsData.getAnalysisMethod(this.props.language),
              currentPopData: this.state.analystMethod,
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.Mesh_Type}
          value={(this.state.meshType && this.state.meshType.key) || ''}
          onPress={async () => {
            this.props.setModalVisible(true, DensityParams.MESH_TYPE, {
              popData: onlineParamsData.getMeshType(this.props.language),
              currentPopData: this.state.meshType,
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.WEIGHT_FIELD}
          value={
            !this.state.weight || this.state.weight === 1
              ? ''
              : this.state.weight
          }
          // value={this.state.weight}
          onPress={async () => {
            // TODO 底部弹框多选，需要获取服务数据
            this.props.clearPopSelected()
            this.props.setModalVisible(true, DensityParams.WEIGHT, {
              popData: onlineParamsData.getWeight(),
              currentPopData: this.state.weight,
            })
          }}
        />
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.ANALYSIS_BOUNDS
          }
          value={this.arrToStr(this.state.bounds)}
          onPress={async () => {
            NavigationService.navigate('AnalystRangePage', {
              bounds: this.state.bounds,
              cb: bounds => {
                NavigationService.goBack()
                this.setState({
                  bounds,
                })
              },
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.MESH_SIZE}
          value={this.state.meshSize + this.state.meshSizeUnit}
          onPress={async () => {
            NavigationService.navigate('InputPage', {
              value: this.state.meshSize,
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .MESH_SIZE,
              placeholder: '',
              // keyboardType: 'numeric',
              type: 'number',
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  meshSize: value,
                })
              },
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.SEARCH_RADIUS}
          value={this.state.radius}
          onPress={async () => {
            NavigationService.navigate('InputPage', {
              value: this.state.radius,
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .SEARCH_RADIUS,
              placeholder: '',
              // keyboardType: 'numeric',
              type: 'number',
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  radius: value,
                })
              },
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.AREA_UNIT}
          value={(this.state.areaUnit && this.state.areaUnit.key) || ''}
          onPress={async () => {
            this.props.setModalVisible(true, DensityParams.AREA_UNIT, {
              popData: onlineParamsData.getAreaUnit(this.props.language),
              currentPopData: this.state.areaUnit,
            })
          }}
        />
      </View>
    )
  }

  /** 专题图参数 **/
  renderThemeParams = () => {
    return (
      <View key="themeParams" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.THEMATIC_PARAMS}
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.INTERVAL_MODE}
          value={(this.state.rangeMode && this.state.rangeMode.key) || ''}
          onPress={async () => {
            this.props.setModalVisible(true, DensityParams.RANGE_MODE, {
              popData: onlineParamsData.getRangeMode(this.props.language),
              currentPopData: this.state.rangeMode,
            })
          }}
        />
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.NUMBER_OF_SEGMENTS
          }
          value={this.state.rangeCount}
          onPress={async () => {
            NavigationService.navigate('InputPage', {
              value: this.state.rangeCount,
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .NUMBER_OF_SEGMENTS,
              placeholder: '',
              // keyboardType: 'numeric',
              type: 'number',
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  rangeCount: value,
                })
              },
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.COLOR_GRADIENT}
          value={
            (this.state.colorGradientType &&
              this.state.colorGradientType.key) ||
            ''
          }
          onPress={async () => {
            this.props.setModalVisible(
              true,
              DensityParams.COLOR_GRADIENT_TYPE,
              {
                popData: onlineParamsData.getColorGradientType(
                  this.props.language,
                ),
                currentPopData: this.state.colorGradientType,
              },
            )
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderAnalystParams()}
        {this.renderThemeParams()}
      </View>
    )
  }
}
