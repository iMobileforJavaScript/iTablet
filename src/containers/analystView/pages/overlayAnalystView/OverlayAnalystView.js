import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import {
  Container,
  TextBtn,
  PopModal,
  FingerMenu,
} from '../../../../components'
import styles from './styles'
import NavigationService from '../../../NavigationService'
import { AnalystItem } from '../../components'
import { ConstPath, ConstInfo } from '../../../../constants'
import { Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import { getLayerIconByType, getLayerWhiteIconByType } from '../../../../assets'
import { SMap, EngineType } from 'imobile_for_reactnative'

const popTypes = {
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  OverlayDataSource: 'OverlayDataSource',
  OverlayDataSet: 'OverlayDataSet',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
}

export default class OverlayAnalystView extends Component {
  props: {
    navigation: Object,
    device: Object,
    currentUser: Object,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.state = {
      title: (params && params.title) || '',
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

  analyst = () => {}

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

  renderSourceData = () => {
    return (
      <View key="sourceData" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>源数据</Text>
        </View>
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
      </View>
    )
  }

  renderOverlayData = () => {
    return (
      <View key="overlayData" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>叠加数据</Text>
        </View>
        <AnalystItem
          title={'数据源'}
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
                this.dsModal && this.dsModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={'数据集'}
          value={
            (this.state.overlayDataSet && this.state.overlayDataSet.value) || ''
          }
          onPress={async () => {
            if (!this.state.overlayDataSource) {
              Toast.show(ConstInfo.SELECT_DATA_SOURCE_FIRST)
              return
            }

            this.currentPop = popTypes.OverlayDataSet
            let udbPath = await FileTools.appendingHomeDirectory(
              this.state.overlayDataSource.path,
            )
            let dataSets = await this.getDataSets(
              {
                server: udbPath,
                engineType: EngineType.UDB,
                alias: this.state.overlayDataSource.key,
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
                currentPopData: this.state.overlayDataSet,
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
          <Text style={styles.subTitle}>叠加数据</Text>
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
                case popTypes.DataSet:
                  newStateData = { dataSet: data }
                  break
                case popTypes.OverlayDataSource:
                  newStateData = { overlayDataSource: data }
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
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={'分析'}
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
          {this.renderSourceData()}
          {this.renderOverlayData()}
          {this.renderResultData()}
        </ScrollView>
        <PopModal ref={ref => (this.dsModal = ref)}>
          {this.renderPopList()}
        </PopModal>
      </Container>
    )
  }
}
