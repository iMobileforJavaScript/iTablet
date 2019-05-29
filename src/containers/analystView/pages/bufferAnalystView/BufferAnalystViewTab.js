import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { AnalystItem } from '../../components'
import { CheckStatus, ConstPath, ConstInfo } from '../../../../constants'
import { CheckBox, PopModal, FingerMenu } from '../../../../components'
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

const FlatType = [
  {
    key: '双侧缓冲',
    value: '双侧缓冲',
  },
  {
    key: '左缓冲',
    value: '左缓冲',
  },
  {
    key: '右缓冲',
    value: '右缓冲',
  },
]

const SemicircleArcData = Array.from({ length: 100 }, (v, k) => ({
  value: k,
  key: k,
}))

export default class BufferAnalystViewTab extends Component {
  props: {
    navigation: Object,
    currentUser: Object,
    data: Array,
    type: string, // single, multiple
    checkData: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: null,
      dataSet: null,
      // 只针对被选择对象进行缓冲操作
      isOperateForSelectedObj: false,
      // 缓冲类型
      roundTypeStatus: CheckStatus.CHECKED,
      flatTypeStatus: CheckStatus.UN_CHECK,
      flatType: FlatType[0],
      // 缓冲半径
      bufferRadius: 10,
      bufferRadiuses: [10, 20, 30],
      bufferRadiusUnit: 'Meter',
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

  getAnalystParams = () => {
    let geoStyle = new GeoStyle()
    geoStyle.setLineColor(50, 240, 50)
    geoStyle.setLineStyle(0)
    geoStyle.setLineWidth(0.5)
    geoStyle.setMarkerStyle(351)
    geoStyle.setMarkerSize(5)
    geoStyle.setFillForeColor(147, 16, 133)
    geoStyle.setFillOpaqueRate(70)
    let params = {
      sourceData: {
        datasource: this.state.dataSource.value,
        dataset: this.state.dataSet.value,
      },
      resultData: {
        datasource: this.state.resultDataSource.value,
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
          case '左缓冲':
            bufferParameter.leftDistance = this.state.bufferRadius
            bufferParameter.rightDistance = 0
            break
          case '右缓冲':
            bufferParameter.leftDistance = 0
            bufferParameter.rightDistance = this.state.bufferRadius
            break
          case '双侧缓冲':
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
      case '圆头缓冲':
        roundTypeStatus = CheckStatus.CHECKED
        flatTypeStatus = CheckStatus.UN_CHECK
        break
      case '平头缓冲':
        roundTypeStatus = CheckStatus.UN_CHECK
        flatTypeStatus = CheckStatus.CHECKED
        break
    }
    this.setState({
      roundTypeStatus,
      flatTypeStatus,
    })
  }

  renderTop = () => {
    return (
      <View key="topView" style={styles.topView}>
        <AnalystItem
          title={'数据源'}
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
                this.dsModal && this.dsModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={'数据集'}
          value={(this.state.dataSet && this.state.dataSet.value) || ''}
          onPress={async () => {
            if (!this.state.dataSource) {
              Toast.show(ConstInfo.SELECT_DATA_SOURCE_FIRST)
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
                this.dsModal && this.dsModal.setVisible(true)
              },
            )
          }}
        />
        <View style={styles.checkView}>
          <CheckBox
            onChange={checked => {
              this.setState({
                isOperateForSelectedObj: checked,
              })
            }}
          />
          <Text style={styles.checkTips}>只针对被选择对象进行缓冲操作</Text>
        </View>
      </View>
    )
  }

  renderType = () => {
    return (
      <View key="typeView" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>缓冲类型</Text>
        </View>
        <AnalystItem
          radioStatus={this.state.roundTypeStatus}
          title={'圆头缓冲'}
          onRadioPress={() => this.changeBufferType('圆头缓冲')}
        />
        <AnalystItem
          radioStatus={this.state.flatTypeStatus}
          title={'平头缓冲'}
          value={this.state.flatType && this.state.flatType.value}
          onRadioPress={() => this.changeBufferType('平头缓冲')}
          onPress={async () => {
            if (this.state.flatTypeStatus !== CheckStatus.CHECKED) return
            this.currentPop = popTypes.BufferType
            this.setState(
              {
                popData: FlatType,
                currentPopData: this.state.flatType,
              },
              () => {
                this.dsModal && this.dsModal.setVisible(true)
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
          <Text style={styles.subTitle}>缓冲半径</Text>
        </View>
        <AnalystItem
          title={'缓冲半径'}
          value={
            this.props.type === 'single'
              ? this.state.bufferRadius + '米'
              : '去设置'
          }
          onPress={() => {
            if (this.props.type === 'single') {
              NavigationService.navigate('InputPage', {
                value: this.state.bufferRadius,
                headerTitle: '缓冲半径',
                placeholder: '请输入缓冲半径',
                keyboardType: 'numeric',
                cb: async value => {
                  NavigationService.goBack()
                  this.setState({
                    bufferRadius: parseInt(value),
                  })
                },
              })
            } else {
              NavigationService.navigate('AnalystRadiusSetting', {
                value: this.state.bufferRadius,
                headerTitle: '批量添加',
                keyboardType: 'numeric',
                cb: async data => {
                  NavigationService.goBack()
                  this.setState({
                    bufferRadiuses: data.radiuses,
                    bufferRadiusUnit: data.unit,
                  })
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
          <Text style={styles.subTitle}>结果设置</Text>
        </View>
        <AnalystItem
          title={'合并缓冲区'}
          value={this.state.isUnionBuffer}
          onChange={value => {
            this.setState({
              isUnionBuffer: value,
            })
          }}
        />
        <AnalystItem
          title={'保留原对象字段属性'}
          value={this.state.isRetainAttribute}
          onChange={value => {
            this.setState({
              isRetainAttribute: value,
            })
          }}
        />
        <AnalystItem
          title={'在地图中展示'}
          value={this.state.isShowOnMap}
          onChange={value => {
            this.setState({
              isShowOnMap: value,
            })
          }}
        />
        {/*<AnalystItem*/}
        {/*title={'在场景中展示'}*/}
        {/*value={this.state.isShowOnScene}*/}
        {/*onChange={value => {*/}
        {/*this.setState({*/}
        {/*isShowOnScene: value,*/}
        {/*})*/}
        {/*}}*/}
        {/*/>*/}
        <AnalystItem
          title={'半圆弧线段数'}
          value={this.state.semicircleArcNum.value}
          onPress={async () => {
            this.currentPop = popTypes.SemicircleArcNum
            this.setState(
              {
                popData: SemicircleArcData,
                currentPopData: this.state.semicircleArcNum,
              },
              () => {
                this.dsModal && this.dsModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={'生成环状缓冲区'}
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
          <Text style={styles.subTitle}>结果数据</Text>
        </View>
        <AnalystItem
          title={'数据源'}
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
                this.dsModal && this.dsModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={'数据集'}
          value={
            (this.state.resultDataSet && this.state.resultDataSet.value) || ''
          }
          onPress={async () => {
            if (!this.state.resultDataSource) {
              Toast.show(ConstInfo.SELECT_DATA_SOURCE_FIRST)
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
            //     this.dsModal && this.dsModal.setVisible(true)
            //   },
            // )

            NavigationService.navigate('InputPage', {
              value: this.state.resultDataSet
                ? this.state.resultDataSet.value
                : '',
              headerTitle: '结果数据集名称',
              placeholder: '',
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

  /** 选择数据源弹出框 **/
  renderPopList = () => {
    return (
      <View style={[styles.popView, { width: '100%' }]}>
        <FingerMenu
          ref={ref => (this.fingerMenu = ref)}
          data={this.state.popData}
          initialKey={
            this.state.currentPopData && this.state.currentPopData.key
          }
        />
        <View style={[styles.btnsView, { width: '100%' }]}>
          <TouchableOpacity
            style={[styles.btnView, { justifyContent: 'flex-start' }]}
            onPress={() => this.dsModal && this.dsModal.setVisible(false)}
          >
            <Text style={styles.btnText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnView, { justifyContent: 'flex-end' }]}
            onPress={() => {
              let { data } = this.fingerMenu && this.fingerMenu.getCurrentData()
              let newStateData = {}
              switch (this.currentPop) {
                case popTypes.DataSource:
                  newStateData = { dataSource: data }
                  break
                case popTypes.DataSet: {
                  let roundTypeStatus = CheckStatus.CHECKED
                  let flatTypeStatus = CheckStatus.UN_CHECK

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
                this.dsModal && this.dsModal.setVisible(false)
              })
            }}
          >
            <Text style={styles.btnText}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        <ScrollView style={styles.container}>
          {this.renderTop()}
          {this.state.showAdvance && this.renderType()}
          {this.state.showAdvance && this.renderBufferRadius()}
          {this.state.showAdvance && this.renderResultSetting()}
          {this.state.showAdvance && this.renderResultData()}
        </ScrollView>
        <PopModal ref={ref => (this.dsModal = ref)}>
          {this.renderPopList()}
        </PopModal>
      </View>
    )
  }
}
