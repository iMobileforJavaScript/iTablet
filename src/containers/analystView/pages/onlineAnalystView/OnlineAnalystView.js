import React, { Component } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Container, TextBtn } from '../../../../components'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { AnalystItem, PopModalList } from '../../components'
import styles from './styles'
import onlineParamsData from './onlineParamsData'

const popTypes = {
  ANALYST_METHOD: 1,
  MESH_TYPE: 2,
  WEIGHT: 3, // 多选
  RANGE_MODE: 4,
  AREA_UNIT: 5,
  COLOR_GRADIENT_TYPE: 6,
}

export default class OnlineAnalystView extends Component {
  props: {
    language: String,
    navigation: Object,
    device: Object,
    currentUser: Object,
    getLayers: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.cb = params && params.cb
    this.state = {
      title: (params && params.title) || '',
      canBeAnalyst: false,

      server: '', // 服务URL
      dataset: '', // 目标数据集
      inputType: '', // 输入方式

      // 分析方法 其中0：简单点密度分析，1：核密度分析
      analystMethod: onlineParamsData.getAnalysisMethod(this.props.language)[0],
      // 网络面类型 其中0：四边形网格，1：六边形网格
      meshType: onlineParamsData.getMeshType(this.props.language)[0],
      // 网格大小单位：Meter(默认),Kilometer,Yard,Foot,Mile
      meshSizeUnit: getLanguage(this.props.language).Analyst_Params.METER,
      weight: 1, // 权重 默认1
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
    this.currentPop = 0
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

  /** 服务和数据集 **/
  renderTop = () => {
    return (
      <View key="topData" style={styles.topView}>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.ISERVER}
          value={this.state.server || ''}
          onPress={async () => {
            NavigationService.navigate('IServerLoginPage', {
              serverUrl: this.state.server || '',
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .ISERVER_LOGIN,
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  server: value,
                })
              },
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.SOURCE_DATASET}
          value={this.state.dataset || ''}
          onPress={async () => {
            NavigationService.navigate('SourceDatasetPage', {
              inputType: this.state.inputType || '',
              dataset: this.state.dataset || '',
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .SOURCE_DATASET,
              cb: async ({ inputType, dataset }) => {
                NavigationService.goBack()
                this.setState({
                  dataset,
                  inputType,
                })
              },
            })
          }}
        />
      </View>
    )
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
            this.currentPop = popTypes.ANALYST_METHOD
            this.setState(
              {
                popData: onlineParamsData.getAnalysisMethod(
                  this.props.language,
                ),
                currentPopData: this.state.analystMethod,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.Mesh_Type}
          value={(this.state.meshType && this.state.meshType.key) || ''}
          onPress={async () => {
            this.currentPop = popTypes.MESH_TYPE
            this.setState(
              {
                popData: onlineParamsData.getMeshType(this.props.language),
                currentPopData: this.state.meshType,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.WEIGHT_FIELD}
          value={this.state.weight === 1 ? '' : this.state.weight}
          // value={this.state.weight}
          onPress={async () => {
            // TODO 底部弹框多选，需要获取服务数据
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
              keyboardType: 'numeric',
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
              keyboardType: 'numeric',
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
            this.currentPop = popTypes.AREA_UNIT
            this.setState(
              {
                popData: onlineParamsData.getAreaUnit(this.props.language),
                currentPopData: this.state.areaUnit,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
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
            this.currentPop = popTypes.RANGE_MODE
            this.setState(
              {
                popData: onlineParamsData.getRangeMode(this.props.language),
                currentPopData: this.state.rangeMode,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
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
              keyboardType: 'numeric',
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
            this.currentPop = popTypes.COLOR_GRADIENT_TYPE
            this.setState(
              {
                popData: onlineParamsData.getColorGradientType(
                  this.props.language,
                ),
                currentPopData: this.state.colorGradientType,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
      </View>
    )
  }

  renderPopList = () => {
    return (
      <PopModalList
        ref={ref => (this.popModal = ref)}
        language={this.props.language}
        popData={this.state.popData}
        currentPopData={this.state.currentPopData}
        confirm={data => {
          let newStateData = {}
          switch (this.currentPop) {
            case popTypes.ANALYST_METHOD:
              newStateData = { analystMethod: data }
              break
            case popTypes.MESH_TYPE:
              newStateData = { meshType: data }
              break
            case popTypes.WEIGHT:
              newStateData = { weight: data }
              break
            case popTypes.RANGE_MODE:
              newStateData = { rangeMode: data }
              break
            case popTypes.AREA_UNIT:
              newStateData = { areaUnit: data }
              break
            case popTypes.COLOR_GRADIENT_TYPE:
              newStateData = { colorGradientType: data }
              break
          }
          this.setState(newStateData, () => {
            this.popModal && this.popModal.setVisible(false)
          })
        }}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          // backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Analyst_Labels.ANALYST}
              textStyle={
                this.state.canBeAnalyst
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.analyst}
            />
          ),
        }}
      >
        <ScrollView style={styles.container}>
          {this.renderTop()}
          {this.renderAnalystParams()}
          {this.renderThemeParams()}
        </ScrollView>
        {this.renderPopList()}
      </Container>
    )
  }
}
