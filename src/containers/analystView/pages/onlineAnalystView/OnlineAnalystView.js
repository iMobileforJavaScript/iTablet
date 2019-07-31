import React, { Component } from 'react'
import { ScrollView, View, InteractionManager } from 'react-native'
import { Container } from '../../../../components'
import NavigationService from '../../../NavigationService'
// import TabNavigationService from '../../../TabNavigationService'
import { getLanguage } from '../../../../language'
import { Toast } from '../../../../utils'
import { AnalystItem, PopModalList, AnalystBar } from '../../components'
import styles from './styles'
import AggregatePointsAnalystView from './AggregatePointsAnalystView'
import DensityAnalystView from './DensityAnalystView'
import onlineParamsData from './onlineParamsData'
import AnalystEntryData from '../analystListEntry/AnalystEntryData'
import { SMap, SAnalyst, EngineType } from 'imobile_for_reactnative'
import { AggregatePointParams, DensityParams } from '../../AnalystType'

export default class OnlineAnalystView extends Component {
  props: {
    language: String,
    navigation: Object,
    iServerData: Object,
    device: Object,
    currentUser: Object,
    getLayers: () => {},
    getDatasetInfoFromIServer: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.cb = params && params.cb
    this.state = {
      type:
        (params && params.type) || AnalystEntryData.onlineAnalysisTypes.DENSITY, // 分析类型
      title: (params && params.title) || '',
      canBeAnalyst: false,

      // 弹出框数据
      popData: [],
      currentPopData: null,

      server: '', // 服务URL
      datasets: '', // 数据集
      datasetName: '', // 目标数据集
      inputType: '', // 输入方式

      popType: 'finger',
    }
    this.currentPop = 0
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      if (
        this.props.iServerData &&
        this.props.iServerData.ip &&
        this.props.iServerData.port
      ) {
        let datasets = await this.getDatasets({
          ip: this.props.iServerData.ip,
          port: this.props.iServerData.port,
        })

        if (datasets.length > 0) {
          await this.getDatasetInfo(datasets[0].value)
          this.setState({
            datasets,
            datasetName: datasets[0].value,
            inputType: 'iServer Catalog',
            canBeAnalyst: true,
          })
        }
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({})
    }
  }

  checkData = () => {
    if (
      !this.props.iServerData.ip ||
      !this.props.iServerData.port ||
      !this.props.iServerData.userName ||
      !this.props.iServerData.password
    ) {
      Toast.show(
        getLanguage(this.props.language).Analyst_Prompt
          .PLEASE_CONNECT_TO_ISERVER,
      )
      return false
    }
    if (!this.state.datasetName) {
      Toast.show(
        getLanguage(this.props.language).Analyst_Prompt.PLEASE_CHOOSE_DATASET,
      )
      return false
    }
    return true
  }

  analyst = () => {
    if (!this.checkData()) return

    switch (this.state.type) {
      case AnalystEntryData.onlineAnalysisTypes.AGGREGATE_POINTS_ANALYSIS: {
        if (!this.aggregatePointsView) break
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Analyst_Prompt.BEING_ANALYZED,
          {
            timeout: 20000,
            timeoutMsg: getLanguage(global.language).Prompt.REQUEST_TIMEOUT,
          },
        )
        let analysisData = this.aggregatePointsView.getData()
        Object.assign(analysisData, { datasetName: this.state.datasetName })

        SAnalyst.aggregatePointsOnline(
          this.props.iServerData,
          analysisData,
          this.analystResult,
        )
        break
      }
      case AnalystEntryData.onlineAnalysisTypes.DENSITY:
      default: {
        if (!this.densityView) break
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Analyst_Prompt.BEING_ANALYZED,
          {
            timeout: 20000,
            timeoutMsg: getLanguage(global.language).Prompt.REQUEST_TIMEOUT,
          },
        )

        let analysisData = this.densityView.getData()
        Object.assign(analysisData, { datasetName: this.state.datasetName })

        SAnalyst.densityOnline(
          this.props.iServerData,
          analysisData,
          this.analystResult,
        )
        break
      }
    }
  }

  analystResult = async res => {
    if (res.result) {
      if (res.datasources && res.datasources instanceof Array) {
        for (let i = 0; i < res.datasources.length; i++) {
          let datasource = res.datasources[i]
          let alias = datasource.substr(datasource.lastIndexOf('/') + 1)
          await SMap.openDatasource(
            {
              server: datasource,
              engineType: EngineType.Rest,
              alias: alias,
            },
            0,
          )
        }
      }

      let layers = await this.props.getLayers()
      layers.length > 0 && (await SMap.setLayerFullView(layers[0].path))
      this.container.setLoading(false)
      NavigationService.goBack('AnalystListEntry')
      // TabNavigationService.navigate('MapAnalystView')
      if (this.cb && typeof this.cb === 'function') {
        this.cb()
      }
    } else {
      this.container.setLoading(false)
      Toast.show(
        getLanguage(this.props.language).Analyst_Prompt.ANALYZING_FAILED +
          '\n' +
          res.error,
      )
    }
  }

  setModalVisible = (visible, type, data) => {
    let popType = 'finger'
    switch (type) {
      case AggregatePointParams.WEIGHT:
      case DensityParams.WEIGHT:
        popType = 'multi'
        break
    }
    let newState = {}
    if (data !== undefined) {
      newState = data
    }
    if (this.state.popType !== popType) {
      newState.popType = popType
    }
    if (Object.keys(newState)) {
      this.currentPop = type
      this.setState(newState, () => {
        this.popModal && this.popModal.setVisible(visible)
      })
    } else {
      this.popModal && this.popModal.setVisible(visible)
    }
  }

  /** 获取数据集数据 **/
  getDatasets = async params => {
    let data = await SAnalyst.getOnlineAnalysisData(params.ip, params.port, 0)
    let datasets = []
    if (data.datasetCount > 0) {
      data.datasetNames.forEach(datasetName => {
        datasets.push({ key: datasetName, value: datasetName })
      })
    }
    return datasets
  }

  /** 获取数据集数据信息 **/
  getDatasetInfo = async dataset => {
    if (global.cookie) {
      let data = await this.props.getDatasetInfoFromIServer({
        ip: this.props.iServerData.ip,
        port: this.props.iServerData.port,
        dataset: dataset,
      })
      let weight = []
      for (let item of data.fieldNames) {
        if (item.toLowerCase().indexOf('sm') !== 0) {
          weight.push({ key: item, value: item })
        }
      }
      onlineParamsData.setWeight(weight)
      this.popModal && this.popModal.clearMultiSelected()
    }
  }

  // 重置页面数据
  reset = () => {
    this.currentPop = ''
    switch (this.state.type) {
      case AnalystEntryData.onlineAnalysisTypes.AGGREGATE_POINTS_ANALYSIS:
        this.aggregatePointsView && this.aggregatePointsView.reset()
        break
      case AnalystEntryData.onlineAnalysisTypes.DENSITY:
        this.densityView && this.densityView.reset()
        break
    }
  }

  /** 服务和数据集 **/
  renderTop = () => {
    return (
      <View key="topData" style={styles.topView}>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.ISERVER}
          value={
            this.props.iServerData.ip && this.props.iServerData.port
              ? this.props.iServerData.ip + ':' + this.props.iServerData.port
              : ''
          }
          onPress={async () => {
            NavigationService.navigate('IServerLoginPage', {
              cb: async params => {
                // 获取数据集数据
                let datasets = await this.getDatasets(params)

                if (datasets.length > 0) {
                  await this.getDatasetInfo(datasets[0].value)
                  this.setState({
                    datasets,
                    datasetName: datasets[0].value,
                    canBeAnalyst: true,
                  })
                }
              },
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.SOURCE_DATASET}
          value={this.state.datasetName || ''}
          onPress={async () => {
            if (
              !this.props.iServerData.ip ||
              !this.props.iServerData.port ||
              !this.props.iServerData.userName ||
              !this.props.iServerData.password
            ) {
              Toast.show(
                getLanguage(this.props.language).Analyst_Prompt
                  .PLEASE_CONNECT_TO_ISERVER,
              )
              return
            }

            NavigationService.navigate('SourceDatasetPage', {
              inputType: this.state.inputType || '',
              dataset:
                {
                  key: this.state.datasetName,
                  value: this.state.datasetName,
                } || '',
              datasets: this.state.datasets || [],
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .SOURCE_DATASET,
              cb: async ({ inputType, dataset }) => {
                NavigationService.goBack()

                if (this.densityView && this.state.datasetName !== dataset) {
                  this.densityView && this.densityView.setWeight(1)
                }

                await this.getDatasetInfo(dataset)

                this.setState({
                  datasetName: dataset,
                  inputType,
                  canBeAnalyst: true,
                })
              },
            })
          }}
        />
      </View>
    )
  }

  renderAnalystParams = () => {
    switch (this.state.type) {
      case AnalystEntryData.onlineAnalysisTypes.AGGREGATE_POINTS_ANALYSIS:
        return (
          <AggregatePointsAnalystView
            ref={ref => (this.aggregatePointsView = ref)}
            {...this.props}
            setModalVisible={this.setModalVisible}
            clearPopSelected={() =>
              this.popModal && this.popModal.clearMultiSelected()
            }
          />
        )
      case AnalystEntryData.onlineAnalysisTypes.DENSITY:
      default:
        return (
          <DensityAnalystView
            ref={ref => (this.densityView = ref)}
            {...this.props}
            setModalVisible={this.setModalVisible}
            clearPopSelected={() =>
              this.popModal && this.popModal.clearMultiSelected()
            }
          />
        )
    }
  }

  renderPopList = () => {
    return (
      <PopModalList
        ref={ref => (this.popModal = ref)}
        language={this.props.language}
        type={this.state.popType}
        popData={this.state.popData}
        currentPopData={this.state.currentPopData}
        confirm={data => {
          switch (this.state.type) {
            case AnalystEntryData.onlineAnalysisTypes.AGGREGATE_POINTS_ANALYSIS:
              if (this.aggregatePointsView) {
                this.aggregatePointsView.popCallback(
                  this.currentPop,
                  data,
                  () => this.setModalVisible(false),
                )
              }
              break
            case AnalystEntryData.onlineAnalysisTypes.DENSITY:
            default:
              if (this.densityView) {
                this.densityView.popCallback(this.currentPop, data, () =>
                  this.setModalVisible(false),
                )
              }
              break
          }
        }}
      />
    )
  }

  renderAnalystBar = () => {
    return (
      <AnalystBar
        leftTitle={getLanguage(this.props.language).Analyst_Labels.RESET}
        rightTitle={getLanguage(this.props.language).Analyst_Labels.ANALYST}
        leftAction={this.reset}
        rightAction={this.analyst}
        rightDisable={!this.state.canBeAnalyst}
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
          // headerRight: (
          //   <TextBtn
          //     btnText={getLanguage(this.props.language).Analyst_Labels.ANALYST}
          //     textStyle={
          //       this.state.canBeAnalyst
          //         ? styles.headerBtnTitle
          //         : styles.headerBtnTitleDisable
          //     }
          //     btnClick={this.analyst}
          //   />
          // ),
        }}
      >
        <ScrollView style={styles.container}>
          {this.renderTop()}
          {this.renderAnalystParams()}
        </ScrollView>
        {this.renderAnalystBar()}
        {this.renderPopList()}
      </Container>
    )
  }
}
