import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { AnalystItem } from '../../components'
import { CheckStatus, ConstPath, ConstInfo } from '../../../../constants'
import { CheckBox, PopModal, FingerMenu } from '../../../../components'
import { FileTools } from '../../../../native'
import { Toast } from '../../../../utils'
import { SMap, EngineType } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'

import styles from './styles'

const popTypes = {
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  FlatTypeStatus: 'FlatTypeStatus',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
  SemicircleArcNum: 'SemicircleArcNum',
}

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
      flatType: '左缓冲',
      // 缓冲半径
      bufferRadio: 10,
      // 结果设置
      isUnionBuffer: false,
      isRetainAttribute: true,
      isShowOnMap: true,
      isShowOnScene: false,
      semicircleArcNum: {
        key: 100,
        value: 100,
      },
      // 结果数据
      resultDataSource: null,
      resultDataSet: null,

      // 弹出框数据
      popData: [],
      currentPopData: null,
    }

    // this.dataSources = []
    // this.dataSets = []
    //
    // this.resultDataSources = []
    // this.resultDataSets = []

    this.currentPop = ''

    this.testData = []
    for (let i = 0; i < 100; i++) {
      this.testData.push({
        key: i,
        value: i,
      })
    }
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
            if (!this.state.dataSource)
              Toast.show(ConstInfo.SELECT_DATA_SOURCE_FIRST)
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
            this.setState(
              {
                popData: dataSets,
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
          value={this.state.flatType}
          onRadioPress={() => this.changeBufferType('平头缓冲')}
          onPress={async () => {
            this.currentPop = popTypes.FlatTypeStatus
            this.setState(
              {
                currentPopData: this.state.flatTypeStatus,
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

  renderBufferRadio = () => {
    return (
      <View key="optionView" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>缓冲半径</Text>
        </View>
        <AnalystItem
          title={'缓冲半径'}
          value={this.state.bufferRadio + '米'}
          onPress={() => {
            NavigationService.navigate('InputPage', {
              value: this.state.bufferRadio,
              headerTitle: '缓冲半径',
              placeholder: '请输入缓冲半径',
              keyboardType: 'numeric',
              cb: async value => {
                NavigationService.goBack()
                this.setState({
                  bufferRadio: value,
                })
              },
            })
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
        <AnalystItem
          title={'在场景中展示'}
          value={this.state.isShowOnScene}
          onChange={value => {
            this.setState({
              isShowOnScene: value,
            })
          }}
        />
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
            if (!this.state.resultDataSource)
              Toast.show(ConstInfo.SELECT_DATA_SOURCE_FIRST)
            this.currentPop = popTypes.ResultDataSet
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
            this.setState(
              {
                popData: dataSets,
                currentPopData: this.state.resultDataSet,
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
                case popTypes.DataSet:
                  newStateData = { dataSet: data }
                  break
                case popTypes.FlatTypeStatus:
                  newStateData = { flatTypeStatus: data }
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
          {this.renderType()}
          {this.renderBufferRadio()}
          {this.renderResultSetting()}
          {this.renderResultData()}
        </ScrollView>
        <PopModal ref={ref => (this.dsModal = ref)}>
          {this.renderPopList()}
        </PopModal>
      </View>
    )
  }
}
