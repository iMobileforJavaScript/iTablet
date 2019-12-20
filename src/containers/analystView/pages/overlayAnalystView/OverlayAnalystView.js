import React, { Component } from 'react'
import { ScrollView, Text, View, InteractionManager } from 'react-native'
import { Container } from '../../../../components'
import styles from './styles'
import NavigationService from '../../../NavigationService'
// import TabNavigationService from '../../../TabNavigationService'
import { AnalystItem, PopModalList, AnalystBar } from '../../components'
import { ConstPath } from '../../../../constants'
import { Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import { getLayerIconByType, getLayerWhiteIconByType } from '../../../../assets'
import { getLanguage } from '../../../../language'
import {
  SMap,
  EngineType,
  SAnalyst,
  DatasetType,
  GeoStyle,
} from 'imobile_for_reactnative'

const popTypes = {
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  OverlayDataSource: 'OverlayDataSource',
  OverlayDataSet: 'OverlayDataSet',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
}

const defaultState = {
  // 源数据
  dataSource: null,
  dataSet: null,
  // 叠加数据
  overlayDataSource: null,
  overlayDataSet: null,
  // 结果数据
  resultDataSource: null,
  resultDataSet: null,

  // 弹出框数据
  popData: [],
  currentPopData: null,

  canBeAnalyst: false,
}

export default class OverlayAnalystView extends Component {
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
      ...defaultState,
    }

    this.currentPop = ''
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevState.dataSource) !==
        JSON.stringify(this.state.dataSource) ||
      JSON.stringify(prevState.dataSet) !==
        JSON.stringify(this.state.dataSet) ||
      JSON.stringify(prevState.overlayDataSource) !==
        JSON.stringify(this.state.overlayDataSource) ||
      JSON.stringify(prevState.overlayDataSet) !==
        JSON.stringify(this.state.overlayDataSet) ||
      JSON.stringify(prevState.resultDataSource) !==
        JSON.stringify(this.state.resultDataSource) ||
      JSON.stringify(prevState.resultDataSet) !==
        JSON.stringify(this.state.resultDataSet)
    ) {
      let canBeAnalyst = this.checkData()
      canBeAnalyst !== this.state.canBeAnalyst &&
        this.setState({
          canBeAnalyst,
        })
    }
  }

  /**
   * 获取源数据过滤数据类型
   * @returns {Array}
   */
  getDataLimit = () => {
    let limit = []
    switch (this.state.title) {
      case getLanguage(this.props.language).Analyst_Methods.UPDATE:
      case getLanguage(this.props.language).Analyst_Methods.UNION:
      case getLanguage(this.props.language).Analyst_Methods.XOR:
        limit = [DatasetType.REGION]
        break
      case getLanguage(this.props.language).Analyst_Methods.CLIP:
      case getLanguage(this.props.language).Analyst_Methods.ERASE:
      case getLanguage(this.props.language).Analyst_Methods.IDENTITY:
      case getLanguage(this.props.language).Analyst_Methods.INTERSECT:
      default:
        limit = []
        break
    }
    return limit
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  checkData = () => {
    let available = false
    if (
      this.state.dataSource &&
      this.state.dataSet &&
      this.state.overlayDataSource &&
      this.state.overlayDataSet &&
      this.state.resultDataSource &&
      this.state.resultDataSet
    ) {
      available = true
    }
    return available
  }

  analyst = () => {
    if (!this.checkData()) return
    Toast.show(getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_START)
    InteractionManager.runAfterInteractions(async () => {
      try {
        this.setLoading(
          true,
          getLanguage(this.props.language).Analyst_Prompt.ANALYSING,
        )
        let geoStyle = new GeoStyle()
        geoStyle.setLineColor(50, 240, 50)
        // geoStyle.setLineStyle(0)
        geoStyle.setLineWidth(0.5)
        // geoStyle.setMarkerStyle(351)
        geoStyle.setMarkerSize(5)
        geoStyle.setFillForeColor(244, 50, 50)
        geoStyle.setFillOpaqueRate(70)

        let server = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            (this.props.currentUser.userName || 'Customer') +
            '/' +
            ConstPath.RelativePath.Datasource,
        )
        let sourceData = {
            datasource: this.state.dataSource.value,
            dataset: this.state.dataSet.value,
          },
          targetData = {
            datasource: this.state.overlayDataSource.value,
            dataset: this.state.overlayDataSet.value,
          },
          resultData = {
            datasetType: this.state.dataSet.datasetType,
            datasource: this.state.resultDataSource.value,
            server: server + this.state.resultDataSource.value + '.udb',
            dataset: this.state.resultDataSet.value,
          },
          optionParameter = {
            geoStyle,
          },
          result = false
        switch (this.state.title) {
          case getLanguage(this.props.language).Analyst_Methods.CLIP:
            result = await SAnalyst.clip(
              sourceData,
              targetData,
              resultData,
              optionParameter,
            )
            break
          case getLanguage(this.props.language).Analyst_Methods.ERASE:
            result = await SAnalyst.erase(
              sourceData,
              targetData,
              resultData,
              optionParameter,
            )
            break
          case getLanguage(this.props.language).Analyst_Methods.IDENTITY:
            result = await SAnalyst.identity(
              sourceData,
              targetData,
              resultData,
              optionParameter,
            )
            break
          case getLanguage(this.props.language).Analyst_Methods.INTERSECT:
            result = await SAnalyst.intersect(
              sourceData,
              targetData,
              resultData,
              optionParameter,
            )
            break
          case getLanguage(this.props.language).Analyst_Methods.UNION:
            result = await SAnalyst.union(
              sourceData,
              targetData,
              resultData,
              optionParameter,
            )
            break
          case getLanguage(this.props.language).Analyst_Methods.UPDATE:
            result = await SAnalyst.update(
              sourceData,
              targetData,
              resultData,
              optionParameter,
            )
            break
          case getLanguage(this.props.language).Analyst_Methods.XOR:
            result = await SAnalyst.xOR(
              sourceData,
              targetData,
              resultData,
              optionParameter,
            )
            break
        }
        this.setLoading(false)

        Toast.show(
          result
            ? getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS
            : getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
        )
        if (result) {
          let layers = await this.props.getLayers()
          layers.length > 0 && (await SMap.setLayerFullView(layers[0].path))

          GLOBAL.ToolBar && GLOBAL.ToolBar.setVisible(false)
          NavigationService.goBack('AnalystListEntry')
          // if (optionParameter.showResult) {
          //   TabNavigationService.navigate('MapAnalystView')
          // }
          if (this.cb && typeof this.cb === 'function') {
            this.cb()
          }
        }
      } catch (e) {
        this.setLoading(false)
        Toast.show(
          getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS,
        )
      }
    })
  }

  back = () => {
    NavigationService.goBack()
  }

  getDataSources = async () => {
    let dsPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        (this.props.currentUser.userName || 'Customer') +
        '/' +
        ConstPath.RelativePath.Datasource,
    )
    let dss = []
    let udbs = await FileTools.getPathListByFilter(dsPath, {
      extension: 'udb',
      type: 'file',
    })
    udbs.forEach(item => {
      item.key = item.name.substr(0, item.name.lastIndexOf('.'))
      item.value = item.key
      dss.push(item)
    })
    return dss
  }

  getDataSets = async (info, filter = {}) => {
    let dss = []
    let dataSets = await SMap.getDatasetsByDatasource(info, true)

    dataSets.list.forEach(item => {
      if (filter.typeFilter && filter.typeFilter.length > 0) {
        for (let type of filter.typeFilter) {
          if (type === item.datasetType) {
            if (
              filter.exclude &&
              ((filter.exclude.dataSource === item.datasourceName &&
                filter.exclude.dataSet === item.datasetName) ||
                (filter.exclude.datasetTypes &&
                  filter.exclude.datasetTypes.indexOf(item.datasetType) > -1))
            )
              continue
            item.key = item.datasetName
            item.value = item.key
            item.icon = getLayerIconByType(item.datasetType)
            item.highLightIcon = getLayerWhiteIconByType(item.datasetType)
            dss.push(item)
            break
          }
        }
      } else {
        if (
          !filter.exclude ||
          ((filter.exclude.dataSource !== item.datasourceName ||
            filter.exclude.dataSet !== item.datasetName) &&
            filter.exclude.datasetTypes &&
            filter.exclude.datasetTypes.indexOf(item.datasetType) < 0)
        ) {
          item.key = item.datasetName
          item.value = item.key
          item.icon = getLayerIconByType(item.datasetType)
          item.highLightIcon = getLayerWhiteIconByType(item.datasetType)
          dss.push(item)
        }
      }
    })
    return dss
  }

  // 重置页面数据
  reset = () => {
    this.setState(Object.assign({}, this.state, defaultState))
    this.currentPop = ''
  }

  renderSourceData = () => {
    return (
      <View key="sourceData" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.SOURCE_DATA}
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DATA_SOURCE}
          value={(this.state.dataSource && this.state.dataSource.value) || ''}
          onPress={async () => {
            this.currentPop = popTypes.DataSource
            let datasources = await this.getDataSources()
            this.setState(
              {
                popData: datasources,
                currentPopData: this.state.dataSource,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DATA_SET}
          value={(this.state.dataSet && this.state.dataSet.value) || ''}
          onPress={async () => {
            if (!this.state.dataSource) {
              Toast.show(
                getLanguage(this.props.language).Analyst_Prompt
                  .SELECT_DATA_SOURCE_FIRST,
              )
              return
            }

            this.currentPop = popTypes.DataSet
            let udbPath = await FileTools.appendingHomeDirectory(
              this.state.dataSource.path,
            )
            let filter = {}
            filter.typeFilter = this.getDataLimit()
            filter.exclude = {}
            if (this.state.overlayDataSet && this.state.overlayDataSet.value) {
              filter.exclude = {
                dataSource: this.state.overlayDataSource.value,
                dataSet: this.state.overlayDataSet.value,
              }
            }
            filter.exclude.datasetTypes = [DatasetType.Network]
            let dataSets = await this.getDataSets(
              {
                server: udbPath,
                engineType: EngineType.UDB,
                alias: this.state.dataSource.key,
              },
              filter,
            )
            this.setState(
              {
                popData: dataSets,
                currentPopData: this.state.dataSet,
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

  renderOverlayData = () => {
    return (
      <View key="overlayData" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.OVERLAY_DATASET}
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DATA_SOURCE}
          value={
            (this.state.overlayDataSource &&
              this.state.overlayDataSource.value) ||
            ''
          }
          onPress={async () => {
            this.currentPop = popTypes.OverlayDataSource
            let datasources = await this.getDataSources()
            this.setState(
              {
                popData: datasources,
                currentPopData: this.state.overlayDataSource,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DATA_SET}
          value={
            (this.state.overlayDataSet && this.state.overlayDataSet.value) || ''
          }
          onPress={async () => {
            if (!this.state.overlayDataSource) {
              Toast.show(
                getLanguage(this.props.language).Analyst_Prompt
                  .SELECT_DATA_SOURCE_FIRST,
              )
              return
            }

            this.currentPop = popTypes.OverlayDataSet
            let udbPath = await FileTools.appendingHomeDirectory(
              this.state.overlayDataSource.path,
            )
            let filter = {}
            filter.typeFilter = [DatasetType.REGION]
            filter.exclude = {}
            if (this.state.dataSet && this.state.dataSet.value) {
              filter.exclude = {
                dataSource: this.state.dataSource.value,
                dataSet: this.state.dataSet.value,
              }
            }
            filter.exclude.datasetTypes = [DatasetType.Network]
            let dataSets = await this.getDataSets(
              {
                server: udbPath,
                engineType: EngineType.UDB,
                alias: this.state.overlayDataSource.key,
              },
              filter,
            )

            this.setState(
              {
                popData: dataSets,
                currentPopData: this.state.overlayDataSet,
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

  renderResultData = () => {
    return (
      <View key="resultData" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.RESULT_DATA}
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DATA_SOURCE}
          value={
            (this.state.resultDataSource &&
              this.state.resultDataSource.value) ||
            ''
          }
          onPress={async () => {
            this.currentPop = popTypes.ResultDataSource
            let datasources = await this.getDataSources()
            this.setState(
              {
                popData: datasources,
                currentPopData: this.state.resultDataSource,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DATA_SET}
          value={
            (this.state.resultDataSet && this.state.resultDataSet.value) || ''
          }
          onPress={async () => {
            if (!this.state.resultDataSource) {
              Toast.show(
                getLanguage(this.props.language).Analyst_Prompt
                  .SELECT_DATA_SOURCE_FIRST,
              )
              return
            }

            NavigationService.navigate('InputPage', {
              value: this.state.resultDataSet
                ? this.state.resultDataSet.value
                : '',
              headerTitle: getLanguage(this.props.language).Analyst_Labels
                .RESULT_DATASET_NAME,
              placeholder: '',
              type: 'name',
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  resultDataSet: {
                    value: value.toString().trim(),
                  },
                })
              },
            })
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
        confirm={async data => {
          let newStateData = {}
          switch (this.currentPop) {
            case popTypes.DataSource:
              newStateData = { dataSource: data }
              if (
                !this.state.dataSource ||
                data.name !== this.state.dataSource.name
              ) {
                // 原数据源为空，或者切换数据源，则自动获取对应数据源第一个数据集
                let udbPath = await FileTools.appendingHomeDirectory(data.path)
                let filter = {}
                filter.typeFilter = this.getDataLimit()
                filter.exclude = {}
                if (
                  this.state.overlayDataSet &&
                  this.state.overlayDataSet.value
                ) {
                  filter.exclude = {
                    dataSource: this.state.overlayDataSource.value,
                    dataSet: this.state.overlayDataSet.value,
                  }
                }
                filter.exclude.datasetTypes = [DatasetType.Network] // 过滤掉网路数据集
                let dataSets = await this.getDataSets(
                  {
                    server: udbPath,
                    engineType: EngineType.UDB,
                    alias: data.key,
                  },
                  filter,
                )

                newStateData = Object.assign(newStateData, {
                  dataSet: dataSets.length > 0 ? dataSets[0] : null,
                })

                // 叠加数据为空，则设置默认值
                if (this.state.overlayDataSource === null) {
                  newStateData = Object.assign(newStateData, {
                    overlayDataSource: data,
                    overlayDataSet: dataSets.length > 1 ? dataSets[1] : null,
                  })
                }
              }

              if (this.state.resultDataSource === null) {
                let resultDatasetName = await SMap.getAvailableDatasetName(
                  data.key,
                  'Overlay',
                )
                // 结果数据源为空时，自动选择目标数据源
                newStateData = Object.assign(newStateData, {
                  resultDataSource: data,
                  resultDataSet: { value: resultDatasetName },
                })
              }
              break
            case popTypes.DataSet:
              newStateData = { dataSet: data }
              break
            case popTypes.OverlayDataSource:
              newStateData = { overlayDataSource: data }
              if (
                !this.state.overlayDataSource ||
                data.name !== this.state.overlayDataSource.name
              ) {
                // 原数据源为空，或者切换数据源，则自动获取对应数据源第一个数据集
                let udbPath = await FileTools.appendingHomeDirectory(data.path)
                let filter = {}
                filter.typeFilter = [DatasetType.REGION]
                filter.exclude = {}
                if (this.state.dataSet && this.state.dataSet.value) {
                  filter.exclude = {
                    dataSource: this.state.dataSource.value,
                    dataSet: this.state.dataSet.value,
                  }
                }
                filter.exclude.datasetTypes = [DatasetType.Network]
                let dataSets = await this.getDataSets(
                  {
                    server: udbPath,
                    engineType: EngineType.UDB,
                    alias: data.key,
                  },
                  filter,
                )

                newStateData = Object.assign(newStateData, {
                  overlayDataSet: dataSets.length > 0 ? dataSets[0] : null,
                })
              }
              break
            case popTypes.OverlayDataSet:
              newStateData = { overlayDataSet: data }
              break
            case popTypes.ResultDataSource:
              newStateData = { resultDataSource: data }
              break
            case popTypes.ResultDataSet:
              newStateData = { resultDataSet: data }
              break
          }
          this.setState(newStateData, () => {
            this.popModal && this.popModal.setVisible(false)
          })
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
          backAction: this.back,
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
          {this.renderSourceData()}
          {this.renderOverlayData()}
          {this.renderResultData()}
        </ScrollView>
        {this.renderAnalystBar()}
        {this.renderPopList()}
      </Container>
    )
  }
}
