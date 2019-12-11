import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { AnalystItem, PopModalList, AnalystBar } from '../../components'
import { CheckStatus, ConstPath } from '../../../../constants'
import { getLanguage } from '../../../../language'
// import { CheckBox } from '../../../../components'
import { FileTools } from '../../../../native'
import { Toast } from '../../../../utils'
import { getLayerIconByType, getLayerWhiteIconByType } from '../../../../assets'
import {
  SMap,
  EngineType,
  DatasetType,
  GeoStyle,
} from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'

import styles from './styles'

const popTypes = {
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  BufferType: 'BufferType',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
  SemicircleArcNum: 'SemicircleArcNum',
}

function getFlatType(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.BUFFER_LEFT_AND_RIGHT,
      value: getLanguage(language).Analyst_Params.BUFFER_LEFT_AND_RIGHT,
    },
    {
      key: getLanguage(language).Analyst_Params.BUFFER_LEFT,
      value: getLanguage(language).Analyst_Params.BUFFER_LEFT,
    },
    {
      key: getLanguage(language).Analyst_Params.BUFFER_RIGHT,
      value: getLanguage(language).Analyst_Params.BUFFER_RIGHT,
    },
  ]
}

// const SemicircleArcData = Array.from({ length: 100 }, (v, k) => ({
//   value: k + 1,
//   key: k + 1,
// }))
const SemicircleArcData = new Array(197).fill('').map((item, index) => {
  return {
    value: index + 4,
    key: index + 4,
  }
})

const defaultState = {
  dataSource: null,
  dataSet: null,
  // 只针对被选择对象进行缓冲操作
  isOperateForSelectedObj: false,
  // 缓冲类型
  roundTypeStatus: CheckStatus.CHECKED,
  flatTypeStatus: CheckStatus.UN_CHECK,
  // 缓冲半径
  bufferRadius: 10,
  bufferRadiuses: [10, 20, 30],
  bufferRadiusUnit: 'Meter',
  stepSize: -1,
  segments: -1,
  // 结果设置
  isUnionBuffer: false,
  isRetainAttribute: true,
  isShowOnMap: true,
  isShowOnScene: false,
  semicircleArcNum: {
    key: 100,
    value: 100,
  },
  isRing: false,
  // 结果数据
  resultDataSource: null,
  resultDataSet: null,

  // 弹出框数据
  popData: [],
  currentPopData: null,

  showAdvance: false,
}

export default class BufferAnalystViewTab extends Component {
  props: {
    navigation: Object,
    currentUser: Object,
    language: string,
    data: Array,
    canBeAnalyst: boolean,
    type: string, // single, multiple
    checkData: () => {},
    analyst: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      ...defaultState,
      flatType: getFlatType(this.props.language)[0],
    }

    this.currentPop = ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevState.dataSource) !==
        JSON.stringify(this.state.dataSource) ||
      JSON.stringify(prevState.dataSet) !==
        JSON.stringify(this.state.dataSet) ||
      JSON.stringify(prevState.resultDataSource) !==
        JSON.stringify(this.state.resultDataSource) ||
      JSON.stringify(prevState.resultDataSet) !==
        JSON.stringify(this.state.resultDataSet)
    ) {
      this.checkData()
    }
  }

  showAdvance = () => {
    if (!this.state.dataSource || !this.state.dataSet) return
    this.setState({
      showAdvance: true,
    })
  }

  checkData = () => {
    let available = false
    if (
      this.state.dataSource &&
      this.state.dataSet &&
      this.state.resultDataSource &&
      this.state.resultDataSet
    ) {
      available = true
    }

    if (this.props.checkData && typeof this.props.checkData === 'function') {
      this.props.checkData(available)
    }
    return available
  }

  getAnalystParams = async () => {
    let geoStyle = new GeoStyle()
    geoStyle.setLineColor(50, 240, 50)
    geoStyle.setLineStyle(0)
    geoStyle.setLineWidth(0.5)
    geoStyle.setMarkerStyle(351)
    geoStyle.setMarkerSize(5)
    geoStyle.setFillForeColor(147, 16, 133)
    geoStyle.setFillOpaqueRate(70)

    let server = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        (this.props.currentUser.userName || 'Customer') +
        '/' +
        ConstPath.RelativePath.Datasource,
    )
    let params = {
      sourceData: {
        datasource: this.state.dataSource.value,
        dataset: this.state.dataSet.value,
      },
      resultData: {
        datasource: this.state.resultDataSource.value,
        server: server + this.state.resultDataSource.value + '.udb',
        dataset: this.state.resultDataSet.value,
      },
      isUnion: this.state.isUnionBuffer,
      isAttributeRetained: this.state.isRetainAttribute,
      optionParameter: {
        showResult: this.state.isShowOnMap,
        geoStyle,
      },
    }
    if (this.props.type === 'single') {
      let bufferParameter = {}
      // 缓冲分析
      if (this.state.flatTypeStatus === CheckStatus.CHECKED) {
        switch (this.state.flatType.value) {
          case getLanguage(this.props.language).Analyst_Params.BUFFER_LEFT:
            bufferParameter.leftDistance = this.state.bufferRadius
            // bufferParameter.rightDistance = 0
            break
          case getLanguage(this.props.language).Analyst_Params.BUFFER_RIGHT:
            // bufferParameter.leftDistance = 0
            bufferParameter.rightDistance = this.state.bufferRadius
            break
          case getLanguage(this.props.language).Analyst_Params
            .BUFFER_LEFT_AND_RIGHT:
          default:
            bufferParameter.leftDistance = this.state.bufferRadius
            bufferParameter.rightDistance = this.state.bufferRadius
            break
        }
      } else {
        bufferParameter.leftDistance = this.state.bufferRadius
        bufferParameter.rightDistance = this.state.bufferRadius
      }
      bufferParameter.endType =
        this.state.roundTypeStatus === CheckStatus.CHECKED ||
        this.state.roundTypeStatus === CheckStatus.CHECKED_DISABLE
          ? 1
          : 2 // 1是圆头， 2是平头
      bufferParameter.semicircleSegments = this.state.semicircleArcNum.value

      params.bufferParameter = bufferParameter
    } else {
      // 多重缓冲分析
      params.bufferRadiuses = this.state.bufferRadiuses
      params.bufferRadiusUnit = this.state.bufferRadiusUnit
      params.isRing = this.state.isRing
      params.semicircleSegments = this.state.semicircleArcNum.value
    }

    return params
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

  getDataSets = async info => {
    let dss = []
    let dataSets = await SMap.getDatasetsByDatasource(info, true)
    dataSets.list.forEach(item => {
      item.key = item.datasetName
      item.value = item.key
      dss.push(item)
    })
    return dss
  }

  changeBufferType = title => {
    let roundTypeStatus
    let flatTypeStatus
    switch (title) {
      case getLanguage(this.props.language).Analyst_Labels.BUFFER_ROUND:
        roundTypeStatus = CheckStatus.CHECKED
        flatTypeStatus = CheckStatus.UN_CHECK
        break
      case getLanguage(this.props.language).Analyst_Labels.BUFFER_FLAT:
        roundTypeStatus = CheckStatus.UN_CHECK
        flatTypeStatus = CheckStatus.CHECKED
        break
    }
    this.setState({
      roundTypeStatus,
      flatTypeStatus,
    })
  }

  // 重置页面数据
  reset = () => {
    this.setState(
      Object.assign(
        {
          flatType: getFlatType(this.props.language)[0],
        },
        defaultState,
      ),
    )
    this.currentPop = ''
  }

  renderTop = () => {
    return (
      <View key="topView" style={styles.topView}>
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
            let dataSets = await this.getDataSets(
              {
                server: udbPath,
                engineType: EngineType.UDB,
                alias: this.state.dataSource.key,
              },
              true,
            )

            let newDataSets = []
            dataSets.forEach(item => {
              let _item = Object.assign({}, item)
              _item.icon = getLayerIconByType(_item.datasetType)
              _item.highLightIcon = getLayerWhiteIconByType(_item.datasetType)
              newDataSets.push(_item)
            })
            this.setState(
              {
                popData: newDataSets,
                currentPopData: this.state.dataSet,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        {/*<View style={styles.checkView}>*/}
        {/*<CheckBox*/}
        {/*onChange={checked => {*/}
        {/*this.setState({*/}
        {/*isOperateForSelectedObj: checked,*/}
        {/*})*/}
        {/*}}*/}
        {/*/>*/}
        {/*<Text style={styles.checkTips}>*/}
        {/*{getLanguage(this.props.language).Analyst_Labels.SELECTED_OBJ_ONLY}*/}
        {/*</Text>*/}
        {/*</View>*/}
      </View>
    )
  }

  renderType = () => {
    return (
      <View key="typeView" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.BUFFER_TYPE}
          </Text>
        </View>
        <AnalystItem
          radioStatus={this.state.roundTypeStatus}
          title={getLanguage(this.props.language).Analyst_Labels.BUFFER_ROUND}
          onRadioPress={() =>
            this.changeBufferType(
              getLanguage(this.props.language).Analyst_Labels.BUFFER_ROUND,
            )
          }
        />
        <AnalystItem
          radioStatus={this.state.flatTypeStatus}
          title={getLanguage(this.props.language).Analyst_Labels.BUFFER_FLAT}
          value={this.state.flatType && this.state.flatType.value}
          onRadioPress={() =>
            this.changeBufferType(
              getLanguage(this.props.language).Analyst_Labels.BUFFER_FLAT,
            )
          }
          onPress={async () => {
            if (this.state.flatTypeStatus !== CheckStatus.CHECKED) return
            this.currentPop = popTypes.BufferType
            this.setState(
              {
                popData: getFlatType(this.props.language),
                currentPopData: this.state.flatType,
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

  renderBufferRadius = () => {
    return (
      <View key="optionView" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.BUFFER_RADIUS}
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.BUFFER_RADIUS}
          value={
            this.props.type === 'single'
              ? this.state.bufferRadius +
                getLanguage(this.props.language).Analyst_Params.METER
              : getLanguage(this.props.language).Analyst_Labels.GO_TO_SET
          }
          onPress={() => {
            if (this.props.type === 'single') {
              NavigationService.navigate('InputPage', {
                value: this.state.bufferRadius,
                headerTitle: getLanguage(this.props.language).Analyst_Labels
                  .BUFFER_RADIUS,
                placeholder:
                  getLanguage(this.props.language).Analyst_Prompt.PLEASE_ENTER +
                  getLanguage(this.props.language).Analyst_Labels.BUFFER_RADIUS,
                // keyboardType: 'numeric',
                type: 'number',
                cb: async value => {
                  NavigationService.goBack()
                  this.setState({
                    bufferRadius: parseInt(value),
                  })
                },
              })
            } else {
              NavigationService.navigate('AnalystRadiusSetting', {
                bufferRadiuses: this.state.bufferRadiuses,
                stepSize: this.state.stepSize,
                segments: this.state.segments,
                headerTitle: getLanguage(this.props.language).Analyst_Labels
                  .BATCH_ADD,
                keyboardType: 'numeric',
                cb: async data => {
                  NavigationService.goBack()
                  let newState = {
                    bufferRadiuses: data.radiuses,
                    bufferRadiusUnit: data.unit,
                  }
                  if (data.stepSize) {
                    newState.stepSize = data.stepSize
                    newState.segments = -1
                  } else if (data.segments) {
                    newState.stepSize = -1
                    newState.segments = data.segments
                  }
                  this.setState(newState)
                },
              })
            }
          }}
        />
      </View>
    )
  }

  renderResultSetting = () => {
    return (
      <View key="resultSetting" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.RESULT_SETTINGS}
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.BUFFER_UNION}
          value={this.state.isUnionBuffer}
          onChange={value => {
            this.setState({
              isUnionBuffer: value,
            })
          }}
        />
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.KEEP_ATTRIBUTES
          }
          value={this.state.isRetainAttribute}
          onChange={value => {
            this.setState({
              isRetainAttribute: value,
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DISPLAY_IN_MAP}
          value={this.state.isShowOnMap}
          onChange={value => {
            this.setState({
              isShowOnMap: value,
            })
          }}
        />
        {/*<AnalystItem*/}
        {/*title={getLanguage(this.props.language).Analyst_Labels.DISPLAY_IN_SCENE}*/}
        {/*value={this.state.isShowOnScene}*/}
        {/*onChange={value => {*/}
        {/*this.setState({*/}
        {/*isShowOnScene: value,*/}
        {/*})*/}
        {/*}}*/}
        {/*/>*/}
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.SEMICIRCLE_SEGMENTS
          }
          value={this.state.semicircleArcNum.value}
          onPress={async () => {
            this.currentPop = popTypes.SemicircleArcNum
            this.setState(
              {
                popData: SemicircleArcData,
                currentPopData: this.state.semicircleArcNum,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.RING_BUFFER}
          value={this.state.isRing}
          onChange={value => {
            this.setState({
              isRing: value,
            })
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

            // this.currentPop = popTypes.ResultDataSet
            // let udbPath = await FileTools.appendingHomeDirectory(
            //   this.state.dataSource.path,
            // )
            // let dataSets = await this.getDataSets(
            //   {
            //     server: udbPath,
            //     engineType: EngineType.UDB,
            //     alias: this.state.dataSource.key,
            //   },
            //   true,
            // )
            // this.setState(
            //   {
            //     popData: dataSets,
            //     currentPopData: this.state.resultDataSet,
            //   },
            //   () => {
            //     this.popModal && this.popModal.setVisible(true)
            //   },
            // )

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

  renderAnalystBar = () => {
    return (
      <AnalystBar
        leftTitle={getLanguage(this.props.language).Analyst_Labels.RESET}
        rightTitle={getLanguage(this.props.language).Analyst_Labels.ANALYST}
        leftAction={this.reset}
        rightAction={this.props.analyst}
        rightDisable={!this.props.canBeAnalyst}
      />
    )
  }

  /** 选择数据源弹出框 **/
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
            case popTypes.DataSource: {
              newStateData = { dataSource: data }
              let udbPath = await FileTools.appendingHomeDirectory(data.path)
              if (
                !this.state.dataSource ||
                data.name !== this.state.dataSource.name
              ) {
                // 原数据源为空，或者切换数据源，则自动获取对应数据源第一个数据集
                let dataSets = await this.getDataSets(
                  {
                    server: udbPath,
                    engineType: EngineType.UDB,
                    alias: data.key,
                  },
                  true,
                )
                const dataset = dataSets.length > 0 ? dataSets[0] : null
                let roundTypeStatus = CheckStatus.CHECKED
                let flatTypeStatus = CheckStatus.UN_CHECK
                if (
                  dataset &&
                  (dataset.datasetType === DatasetType.REGION ||
                    dataset.datasetType === DatasetType.POINT)
                ) {
                  roundTypeStatus = CheckStatus.CHECKED_DISABLE
                  flatTypeStatus = CheckStatus.UN_CHECK_DISABLE
                }
                newStateData = Object.assign(newStateData, {
                  dataSet: dataset,
                  showAdvance: dataSets.length > 0,
                  roundTypeStatus,
                  flatTypeStatus,
                })
              }
              if (this.state.resultDataSource === null) {
                let resultDatasetName = await SMap.getAvailableDatasetName(
                  data.key,
                  'Buffer',
                )
                // 结果数据源为空时，自动选择目标数据源
                newStateData = Object.assign(newStateData, {
                  resultDataSource: data,
                  resultDataSet: { value: resultDatasetName },
                  roundTypeStatus: CheckStatus.CHECKED,
                  flatTypeStatus: CheckStatus.UN_CHECK,
                })
              }
              break
            }
            case popTypes.DataSet: {
              let roundTypeStatus = CheckStatus.CHECKED
              let flatTypeStatus = CheckStatus.UN_CHECK

              newStateData = { dataSet: data }
              if (data) {
                if (
                  data.datasetType === DatasetType.REGION ||
                  data.datasetType === DatasetType.POINT
                ) {
                  roundTypeStatus = CheckStatus.CHECKED_DISABLE
                  flatTypeStatus = CheckStatus.UN_CHECK_DISABLE
                }

                newStateData = this.state.showAdvance
                  ? { dataSet: data, roundTypeStatus, flatTypeStatus }
                  : {
                    dataSet: data,
                    showAdvance: true,
                    roundTypeStatus,
                    flatTypeStatus,
                  }
              }

              break
            }
            case popTypes.BufferType:
              newStateData = { flatType: data }
              break
            case popTypes.SemicircleArcNum:
              newStateData = { semicircleArcNum: data }
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {this.renderTop()}
          {this.state.showAdvance && this.renderType()}
          {this.state.showAdvance && this.renderBufferRadius()}
          {this.state.showAdvance && this.renderResultSetting()}
          {this.state.showAdvance && this.renderResultData()}
        </ScrollView>
        {this.renderAnalystBar()}
        {this.renderPopList()}
      </View>
    )
  }
}
