import React, { Component } from 'react'
import { ScrollView, Text, View, InteractionManager } from 'react-native'
import { Container } from '../../../../components'
import styles from './styles'
import NavigationService from '../../../NavigationService'
// import TabNavigationService from '../../../TabNavigationService'
import { AnalystItem, PopModalList, AnalystBar } from '../../components'
import {
  ConstPath,
  CheckStatus,
  TouchType,
  ConstToolType,
} from '../../../../constants'
import { Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import { getLayerIconByType, getLayerWhiteIconByType } from '../../../../assets'
import { getLanguage } from '../../../../language'
// import { Analyst_Types } from '../../AnalystType'
import {
  SMap,
  EngineType,
  SAnalyst,
  DatasetType,
  Action,
} from 'imobile_for_reactnative'

const popTypes = {
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  ReferenceDataSource: 'ReferenceDataSource',
  ReferenceDataSet: 'ReferenceDataSet',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
}

const defaultState = {
  // 源数据
  dataSource: null,
  dataSet: null,
  // 显示区域设置
  isCustomLocale: false,
  selectRegionStatus: CheckStatus.CHECKED, // 选择面
  drawRegionStatus: CheckStatus.UN_CHECK, // 绘制面

  // 邻近数据
  referenceDataSource: null,
  referenceDataSet: null,

  // 参数设置
  measureType: '',
  distanceInRange: [],
  minDistance: 0,
  maxDistance: 1,

  // 结果数据
  resultDataSource: null,
  resultDataSet: null,

  // 弹出框数据
  popData: [],
  currentPopData: null,

  canBeAnalyst: false,
}

export default class ReferenceAnalystView extends Component {
  props: {
    language: String,
    navigation: Object,
    device: Object,
    currentUser: Object,
    map: Object,
    layers: Array,
    selection: Array,
    getLayers: () => {},
    setSelection: () => {},
    setAnalystParams: () => {},
    setBackAction: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.cb = params && params.cb
    this.type = params && params.type
    this.defaultState = params && params.defaultState
    if (this.defaultState) {
      this.state = this.defaultState
    } else {
      this.state = {
        title: (params && params.title) || '',
        ...defaultState,
      }
    }

    this.currentPop = ''
  }

  componentDidMount() {
    this.props.setBackAction({
      action: () => this.back(),
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      let canBeAnalyst = this.checkData()
      canBeAnalyst !== this.state.canBeAnalyst &&
        this.setState({
          canBeAnalyst,
        })
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  checkData = () => {
    let available = false
    if (
      this.state.dataSource &&
      this.state.dataSet &&
      // this.state.overlayDataSource &&
      // this.state.overlayDataSet &&
      this.state.resultDataSource &&
      this.state.resultDataSet
    ) {
      available = true
    }
    return available
  }

  analyst = () => {
    if (!this.checkData()) return

    let optionParameter = {}
    // 泰森
    if (
      this.type === ConstToolType.MAP_ANALYSIS_THIESSEN_POLYGON &&
      this.state.isCustomLocale
    ) {
      // 检查选择面
      if (this.state.selectRegionStatus === CheckStatus.CHECKED) {
        if (
          this.props.selection.length > 0 &&
          this.props.selection[0].ids.length > 0 &&
          this.props.selection[0].layerInfo.type === DatasetType.REGION
        ) {
          optionParameter = {
            selectRegion: {
              layerPath: this.props.selection[0].layerInfo.path,
              geoId: this.props.selection[0].ids[0],
            },
          }
        } else {
          Toast.show(
            getLanguage(this.props.language).Analyst_Prompt
              .PLEASE_SELECT_A_REGION,
          )
          return
        }
      }
    }

    Toast.show(getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_START)
    InteractionManager.runAfterInteractions(async () => {
      try {
        this.setLoading(
          true,
          getLanguage(this.props.language).Analyst_Prompt.ANALYSING,
        )

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
          resultData = {
            datasource: this.state.resultDataSource.value,
            server: server + this.state.resultDataSource.value + '.udb',
            dataset: this.state.resultDataSet.value,
          },
          result = false
        switch (this.type) {
          case ConstToolType.MAP_ANALYSIS_THIESSEN_POLYGON:
            if (this.state.isCustomLocale) {
              if (this.state.selectRegionStatus === CheckStatus.CHECKED) {
                optionParameter = {
                  selectRegion: {
                    layerPath: this.props.selection[0].layerInfo.path,
                    geoId: this.props.selection[0].ids[0],
                  },
                }
              } else {
                optionParameter = { drawRegion: true }
              }
            }
            result = await SAnalyst.thiessenAnalyst(
              sourceData,
              resultData,
              optionParameter,
            )
            break
          case ConstToolType.MAP_ANALYSIS_MEASURE_DISTANCE:
            // result = await SAnalyst.erase(
            //   sourceData,
            //   targetData,
            //   resultData,
            //   optionParameter,
            // )
            break
        }
        this.setLoading(false)

        Toast.show(
          result
            ? getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS
            : getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
        )
        SMap.setAction(Action.SELECT).then(() => {
          SMap.setAction(Action.PAN)
        })
        if (result) {
          let layers = await this.props.getLayers()
          layers.length > 0 && (await SMap.setLayerFullView(layers[0].path))

          GLOBAL.ToolBar && GLOBAL.ToolBar.setVisible(false)
          NavigationService.goBack('ReferenceAnalystView')
          if (this.cb && typeof this.cb === 'function') {
            this.cb()
          }
        }
      } catch (e) {
        SMap.setAction(Action.SELECT).then(() => {
          SMap.setAction(Action.PAN)
        })
        this.setLoading(false)
        Toast.show(
          getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
        )
      }
    })
    // ;(async function() {
    //
    // }.bind(this)())
  }

  back = () => {
    SMap.clearSelection()
    SMap.setAction(Action.PAN)
    this.props.setSelection && this.props.setSelection(null)
    NavigationService.goBack('ReferenceAnalystView')
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
              filter.exclude.dataSource === item.datasourceName &&
              filter.exclude.dataSet === item.datasetName
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
          filter.exclude.dataSource !== item.datasourceName ||
          filter.exclude.dataset !== item.datasetName
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

  changeBufferType = (title, cb) => {
    let selectRegionStatus
    let drawRegionStatus
    switch (title) {
      case getLanguage(this.props.language).Analyst_Labels.SELECT_REGION:
        selectRegionStatus = CheckStatus.CHECKED
        drawRegionStatus = CheckStatus.UN_CHECK
        break
      case getLanguage(this.props.language).Analyst_Labels.DRAW_REGION:
        selectRegionStatus = CheckStatus.UN_CHECK
        drawRegionStatus = CheckStatus.CHECKED
        break
    }
    this.setState(
      {
        selectRegionStatus,
        drawRegionStatus,
      },
      () => cb && cb(),
    )
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
            filter.typeFilter = [DatasetType.POINT]
            if (this.state.overlayDataSet && this.state.overlayDataSet.value) {
              filter.exclude = {
                dataSource: this.state.overlayDataSource.value,
                dataSet: this.state.overlayDataSet.value,
              }
            }
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

  renderReferenceData = () => {
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
            if (this.state.dataSet && this.state.dataSet.value) {
              filter.exclude = {
                dataSource: this.state.dataSource.value,
                dataSet: this.state.dataSet.value,
              }
            }
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

  renderDisplaySettingsData = () => {
    return (
      <View key="overlayData" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {
              getLanguage(this.props.language).Analyst_Labels
                .DISPLAY_REGION_SETTINGS
            }
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.CUSTOM_LOCALE}
          value={this.state.isCustomLocale}
          disable={
            this.props.layers === undefined || this.props.layers.length === 0
          }
          onChange={value => {
            this.setState({
              isCustomLocale: value,
            })
          }}
        />
        {this.state.isCustomLocale && (
          <View>
            <AnalystItem
              radioStatus={this.state.selectRegionStatus}
              title={
                getLanguage(this.props.language).Analyst_Labels.SELECT_REGION
              }
              value={''}
              onPress={() => {
                this.changeBufferType(
                  getLanguage(this.props.language).Analyst_Labels.SELECT_REGION,
                  () => {
                    let params = Object.assign(
                      {},
                      this.props.navigation.state.params,
                      { defaultState: this.state },
                    )
                    this.props
                      .setAnalystParams({
                        ...params,
                        actionType: 'select',
                        title: getLanguage(this.props.language).Analyst_Labels
                          .SELECT_REGION,
                        backAction: () => {
                          this.props.setAnalystParams(null)
                          // SMap.setAction(Action.PAN)
                          NavigationService.navigate('ReferenceAnalystView', {
                            ...params,
                          })
                        },
                      })
                      .then(() => {
                        SMap.getAction().then(type => {
                          if (type !== Action.SELECT) {
                            SMap.setAction(Action.SELECT)
                          }
                          NavigationService.goBack('ReferenceAnalystView')
                        })
                      })
                  },
                )
              }}
              onRadioPress={() => {
                this.changeBufferType(
                  getLanguage(this.props.language).Analyst_Labels.SELECT_REGION,
                )
              }}
            />
            <AnalystItem
              radioStatus={this.state.drawRegionStatus}
              title={
                getLanguage(this.props.language).Analyst_Labels.DRAW_REGION
              }
              value={''}
              onPress={() => {
                this.changeBufferType(
                  getLanguage(this.props.language).Analyst_Labels.DRAW_REGION,
                  () => {
                    let params = Object.assign(
                      {},
                      this.props.navigation.state.params,
                      { defaultState: this.state },
                    )
                    this.props
                      .setAnalystParams({
                        ...params,
                        actionType: 'draw',
                        title: getLanguage(this.props.language).Analyst_Labels
                          .DRAW_REGION,
                        backAction: () => {
                          this.props.setAnalystParams(null)
                          NavigationService.navigate('ReferenceAnalystView', {
                            ...params,
                          })
                        },
                      })
                      .then(() => {
                        GLOBAL.TouchType = TouchType.REFERENCE
                        SMap.getAction().then(type => {
                          if (type !== Action.CREATEPOLYGON) {
                            SMap.setAction(Action.CREATEPOLYGON)
                          }
                          NavigationService.goBack('ReferenceAnalystView')
                        })
                      })
                  },
                )
              }}
              onRadioPress={() => {
                this.changeBufferType(
                  getLanguage(this.props.language).Analyst_Labels.DRAW_REGION,
                )
              }}
            />
          </View>
        )}
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
                NavigationService.goBack('InputPage')
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
                let udbPath = await FileTools.appendingHomeDirectory(data.path)
                let filter = {}
                filter.typeFilter = [DatasetType.POINT]
                if (
                  this.state.overlayDataSet &&
                  this.state.overlayDataSet.value
                ) {
                  filter.exclude = {
                    dataSource: this.state.overlayDataSource.value,
                    dataSet: this.state.overlayDataSet.value,
                  }
                }
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
              }
              if (this.state.resultDataSource === null) {
                let resultDatasetName = await SMap.getAvailableDatasetName(
                  data.key,
                  'Thiessen',
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
            case popTypes.ReferenceDataSource:
              newStateData = { referenceDataSource: data }
              if (
                this.state.referenceDataSource &&
                data.name !== this.state.referenceDataSource.name
              ) {
                newStateData = Object.assign(newStateData, {
                  referenceDataSet: null,
                })
              }
              break
            case popTypes.ReferenceDataSet:
              newStateData = { referenceDataSet: data }
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
          {this.type === ConstToolType.MAP_ANALYSIS_THIESSEN_POLYGON &&
            this.renderDisplaySettingsData()}
          {this.type === ConstToolType.MAP_ANALYSIS_MEASURE_DISTANCE &&
            this.renderReferenceData()}
          {this.renderResultData()}
        </ScrollView>
        {this.renderAnalystBar()}
        {this.renderPopList()}
      </Container>
    )
  }
}
