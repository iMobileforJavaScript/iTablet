import React, { Component } from 'react'
import { Text, View } from 'react-native'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { AnalystItem } from '../../components'
import { AggregatePointParams } from '../../AnalystType'
import styles from './styles'
import onlineParamsData from './onlineParamsData'

export default class AggregatePointsAnalystView extends Component {
  props: {
    language: String,
    navigation: Object,
    device: Object,
    currentUser: Object,
    setModalVisible: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      // 聚合类型支持 "SUMMARYMESH" 网格面聚合、"SUMMARYREGION" 多边形聚合
      aggregateType: onlineParamsData.getAggregateType(this.props.language)[0],
      // 网络面类型 其中0：四边形网格，1：六边形网格
      meshType: onlineParamsData.getMeshType(this.props.language)[0],
      bounds: [], // 分析范围：左-下-右-上
      meshSize: 30, // 网格大小（分辨率）
      // 网格大小单位：Meter(默认),Kilometer,Yard,Foot,Mile
      meshSizeUnit: getLanguage(this.props.language).Analyst_Params.METER,

      weightAndStatisticMode: [], // weight 和 statisticMode数据数组
      weight: 1, // 权重 默认1
      // 统计模式支持：max 最大值,min 最小值,average 平均值,sum 求和,variance 方差,stdDeviation 标准差。
      // “统计模式”个数应与“权重值字段”个数一致
      statisticModes: '',

      // 数字精度 默认为 1
      numericPrecision: 1,
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
    let data = {}
    let weight = ''
    let statisticModes = ''

    if (this.state.weightAndStatisticMode.length > 0) {
      this.state.weightAndStatisticMode.forEach((item, index) => {
        weight += item[0].value
        statisticModes += item[1].value

        if (index < this.state.weightAndStatisticMode.length - 1) {
          weight += ','
          statisticModes += ','
        }
      })
      data.weight = weight
      data.statisticModes = statisticModes
    }
    data.aggregateType = this.state.aggregateType.value
    data.meshType = this.state.meshType.value
    data.bounds = this.state.bounds
    data.meshSize = this.state.meshSize
    data.meshSizeUnit = 'Meter'
    data.numericPrecision = this.state.numericPrecision
    data.rangeMode = this.state.rangeMode.value
    data.rangeCount = this.state.rangeCount
    data.colorGradientType = this.state.colorGradientType.value
    return data
  }

  popCallback = (type, data = {}, cb = () => {}) => {
    let newStateData = {}
    switch (type) {
      case AggregatePointParams.AGGREGATE_TYPE:
        newStateData = { aggregateType: data }
        break
      case AggregatePointParams.MESH_TYPE:
        newStateData = { meshType: data }
        break
      // case AggregatePointParams.WEIGHT:
      //   newStateData = { weight: data }
      //   break
      case AggregatePointParams.RANGE_MODE:
        newStateData = { rangeMode: data }
        break
      case AggregatePointParams.AREA_UNIT:
        newStateData = { areaUnit: data }
        break
      case AggregatePointParams.COLOR_GRADIENT_TYPE:
        newStateData = { colorGradientType: data }
        break
    }
    this.setState(newStateData, () => {
      cb && cb()
    })
  }

  reset = () => {
    this.setState({
      aggregateType: onlineParamsData.getAggregateType(this.props.language)[0],
      meshType: onlineParamsData.getMeshType(this.props.language)[0],
      bounds: [],
      meshSize: 30,
      meshSizeUnit: getLanguage(this.props.language).Analyst_Params.METER,
      weightAndStatisticMode: [],
      weight: 1,
      statisticModes: '',
      numericPrecision: 1,
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
          title={getLanguage(this.props.language).Analyst_Labels.AGGREGATE_TYPE}
          value={
            (this.state.aggregateType && this.state.aggregateType.key) || ''
          }
          onPress={async () => {
            this.props.setModalVisible(
              true,
              AggregatePointParams.AGGREGATE_TYPE,
              {
                popData: onlineParamsData.getAggregateType(this.props.language),
                currentPopData: this.state.aggregateType,
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.Mesh_Type}
          value={(this.state.meshType && this.state.meshType.key) || ''}
          onPress={async () => {
            this.props.setModalVisible(true, AggregatePointParams.MESH_TYPE, {
              popData: onlineParamsData.getMeshType(this.props.language),
              currentPopData: this.state.meshType,
            })
          }}
        />
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.ANALYSIS_BOUNDS
          }
          value={this.arrToStr(this.state.bounds)}
          onPress={async () => {
            // TODO 跳转页面，输入四个边框位置
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
          title={getLanguage(this.props.language).Analyst_Labels.WEIGHT_FIELD}
          // value={this.state.weight === 1 ? '' : this.state.weight}
          value={
            this.state.weightAndStatisticMode.length === 0
              ? getLanguage(this.props.language).Analyst_Labels.NOT_SET
              : getLanguage(this.props.language).Analyst_Labels.ALREADY_SET
          }
          onPress={async () => {
            // TODO 底部弹框多选，需要获取服务数据
            NavigationService.navigate('WeightAndStatistic', {
              data: this.state.weightAndStatisticMode,
              cb: data => {
                this.setState({
                  weightAndStatisticMode: data,
                })
              },
            })
          }}
        />
        {/*<AnalystItem*/}
        {/*title={getLanguage(this.props.language).Analyst_Labels.STATISTIC_MODE}*/}
        {/*value={(this.state.statisticModes && this.state.statisticModes.key) || ''}*/}
        {/*onPress={async () => {*/}

        {/*}}*/}
        {/*/>*/}
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
          title={
            getLanguage(this.props.language).Analyst_Labels.NUMERIC_PRECISION
          }
          value={this.state.numericPrecision}
          onPress={async () => {
            NavigationService.navigate('InputPage', {
              value: this.state.numericPrecision,
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .NUMERIC_PRECISION,
              placeholder: '',
              // keyboardType: 'numeric',
              type: 'number',
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  numericPrecision: value,
                })
              },
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.INTERVAL_MODE}
          value={(this.state.rangeMode && this.state.rangeMode.key) || ''}
          onPress={async () => {
            this.props.setModalVisible(true, AggregatePointParams.RANGE_MODE, {
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
              AggregatePointParams.COLOR_GRADIENT_TYPE,
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
