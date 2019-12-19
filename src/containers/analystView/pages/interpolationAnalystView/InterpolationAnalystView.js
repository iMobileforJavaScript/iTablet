import React, { Component } from 'react'
import { ScrollView, Text, View, KeyboardAvoidingView } from 'react-native'
import { Container, TextBtn } from '../../../../components'
import styles from './styles'
import NavigationService from '../../../NavigationService'
import { AnalystItem, PopModalList } from '../../components'
import { ConstPath, Const } from '../../../../constants'
import { Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import { getLayerIconByType, getLayerWhiteIconByType } from '../../../../assets'
import { getLanguage } from '../../../../language'
import InterpolationParamsData from './interpolationParamsData'
import {
  SMap,
  EngineType,
  DatasetType,
  FieldType,
} from 'imobile_for_reactnative'

const popTypes = {
  Method: 'Method',
  DataSource: 'DataSource',
  DataSet: 'DataSet',
  FieldInfos: 'FieldInfos',
  ResultDataSource: 'ResultDataSource',
  ResultDataSet: 'ResultDataSet',
  PixelFormat: 'PixelFormat',
}

const defaultState = {
  method: InterpolationParamsData.getInterpolationMethod(GLOBAL.language)[0],
  // 源数据
  dataSource: null,
  dataSet: null,
  interpolationField: null,
  scale: 1,
  // 结果数据
  resultDataSource: null,
  resultDataSet: null,
  resolution: 500,
  pixelFormat: InterpolationParamsData.getPixelFormat(GLOBAL.language)[2],
  // 插值范围
  left: 0,
  bottom: 0,
  right: 0,
  top: 0,

  // 弹出框数据
  popData: [],
  currentPopData: null,

  btnAvailable: false,
}

export default class InterpolationAnalystView extends Component {
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
    this.datasourcePath = ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevState) !== JSON.stringify(this.state) ||
      JSON.stringify(prevProps.language) !==
        JSON.stringify(this.props.language) ||
      JSON.stringify(prevProps.currentUser) !==
        JSON.stringify(this.props.currentUser) ||
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      let btnAvailable = this.checkData()
      btnAvailable !== this.state.btnAvailable &&
        this.setState({
          btnAvailable,
        })
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  checkData = () => {
    let available = false
    if (
      this.state.resolution !== '' &&
      !isNaN(this.state.resolution) &&
      !isNaN(this.state.top) &&
      !isNaN(this.state.bottom) &&
      !isNaN(this.state.left) &&
      !isNaN(this.state.right) &&
      this.state.method &&
      this.state.dataSource &&
      this.state.dataSet &&
      this.state.interpolationField &&
      this.state.resultDataSource &&
      this.state.resultDataSet
    ) {
      available = true
    }
    return available
  }

  back = () => {
    NavigationService.goBack('InterpolationAnalystView')
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

  getFieldInfos = async (info, filter) => {
    let infos = []
    let fieldInfos = await SMap.getFieldInfos(info, filter)

    fieldInfos.forEach(item => {
      item.key = item.name
      item.value = item.key
      infos.push(item)
    })
    return infos
  }

  // 重置页面数据
  reset = () => {
    this.setState(Object.assign({}, this.state, defaultState))
    this.currentPop = ''
  }

  renderMethod = () => {
    return (
      <View key="method" style={styles.topView}>
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.INTERPOLATION_METHOD
          }
          value={
            this.state.method && this.state.method.key !== undefined
              ? this.state.method.key
              : ''
          }
          onPress={async () => {
            this.currentPop = popTypes.Method
            this.setState(
              {
                popData: InterpolationParamsData.getInterpolationMethod(
                  this.props.language,
                ),
                currentPopData:
                  this.state.method ||
                  InterpolationParamsData.getInterpolationMethod(
                    this.props.language,
                  )[0],
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
                currentPopData:
                  this.state.dataSource ||
                  (datasources.length > 0 && datasources[0]) ||
                  null,
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
                currentPopData:
                  this.state.dataSet ||
                  (dataSets.length > 0 && dataSets[0]) ||
                  null,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={
            getLanguage(this.props.language).Analyst_Labels.INTERPOLATION_FIELD
          }
          value={
            (this.state.interpolationField &&
              this.state.interpolationField.value) ||
            ''
          }
          onPress={async () => {
            if (!this.state.dataSource) {
              Toast.show(
                getLanguage(this.props.language).Analyst_Prompt
                  .SELECT_DATA_SOURCE_FIRST,
              )
              return
            }
            if (!this.state.dataSet) {
              Toast.show(
                getLanguage(this.props.language).Analyst_Prompt
                  .SELECT_DATA_SET_FIRST,
              )
              return
            }

            this.currentPop = popTypes.FieldInfos
            let udbPath = await FileTools.appendingHomeDirectory(
              this.state.dataSource.path,
            )
            let filter = {}
            filter.typeFilter = [
              FieldType.INT16,
              FieldType.INT32,
              FieldType.INT64,
              FieldType.SINGLE,
              FieldType.DOUBLE,
            ]
            let fieldInfos = await this.getFieldInfos(
              {
                server: udbPath,
                engineType: EngineType.UDB,
                alias: this.state.dataSource.key,
                datasetName: this.state.dataSet.datasetName,
              },
              filter,
            )
            this.setState(
              {
                popData: fieldInfos,
                currentPopData:
                  (fieldInfos.length > 0 && fieldInfos[0]) || null,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.SCALE_FACTOR}
          value={this.state.scale + ''}
          rightProps={{
            minValue: 1,
            maxValue: 10,
            type: 'input',
          }}
          rightType={'number_counter'}
          onChange={value => {
            this.setState({
              scale: value,
            })
          }}
          onSubmitEditing={text => {
            if (text !== this.state.scale) {
              this.setState({
                scale: text === '' || isNaN(text) ? 0 : text,
              })
            }
          }}
          onBlur={text => {
            if (text !== this.state.scale) {
              this.setState({
                scale: text === '' || isNaN(text) ? 0 : text,
              })
            }
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
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.RESOLUTION}
          value={this.state.resolution + ''}
          rightProps={{
            minValue: 0,
            type: 'input',
          }}
          rightType={'number_counter'}
          onChange={value => {
            this.setState({
              resolution: value,
            })
          }}
          onSubmitEditing={text => {
            if (text !== this.state.resolution) {
              this.setState({
                resolution: text === '' || isNaN(text) ? 0 : text,
              })
            }
          }}
          onBlur={text => {
            if (text !== this.state.resolution) {
              this.setState({
                resolution: text === '' || isNaN(text) ? 0 : text,
              })
            }
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.PIXEL_FORMAT}
          value={this.state.pixelFormat ? this.state.pixelFormat.key : ''}
          onPress={async () => {
            this.popModal && this.popModal.setVisible(true)
            this.currentPop = popTypes.PixelFormat
            let pixelFormat = InterpolationParamsData.getPixelFormat(
              this.props.language,
            )
            this.setState(
              {
                popData: pixelFormat,
                currentPopData: this.state.pixelFormat,
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

  renderRange = () => {
    return (
      <View key="range" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {
              getLanguage(this.props.language).Analyst_Labels
                .INTERPOLATION_BOUNDS
            }
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.LEFT}
          value={this.state.left}
          keyboardType={'numeric'}
          rightType={'input'}
          rightStyle={{ flex: 1 }}
          inputStyle={{ flex: 1 }}
          autoCheckNumber
          onChangeText={text => {
            this.setState({
              left: text,
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.DOWN}
          value={this.state.bottom}
          keyboardType={'numeric'}
          rightType={'input'}
          rightStyle={{ flex: 1 }}
          inputStyle={{ flex: 1 }}
          autoCheckNumber
          onChangeText={text => {
            this.setState({
              bottom: text,
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.RIGHT}
          value={this.state.right}
          keyboardType={'numeric'}
          rightType={'input'}
          rightStyle={{ flex: 1 }}
          inputStyle={{ flex: 1 }}
          autoCheckNumber
          onChangeText={text => {
            this.setState({
              right: text,
            })
          }}
        />
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.UP}
          value={this.state.top}
          keyboardType={'numeric'}
          rightType={'input'}
          inputStyle={{ flex: 1 }}
          rightStyle={{ flex: 1 }}
          autoCheckNumber
          onChangeText={text => {
            this.setState({
              top: text,
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
        confirm={data => {
          (async function() {
            let newStateData = {}
            switch (this.currentPop) {
              case popTypes.Method:
                newStateData = { method: data }
                break
              case popTypes.DataSource: {
                newStateData = { dataSource: data }
                if (!this.state.resultDataSource) {
                  newStateData.resultDataSource = data
                  newStateData.resultDataSet = {
                    value: 'Interpolation',
                  }
                }
                if (
                  !this.state.dataSource ||
                  data.name !== this.state.dataSource.name
                ) {
                  this.datasourcePath = await FileTools.appendingHomeDirectory(
                    data.path,
                  )
                  let filter = {}
                  filter.typeFilter = [DatasetType.POINT]
                  let dataSets = await this.getDataSets(
                    {
                      server: this.datasourcePath,
                      engineType: EngineType.UDB,
                      alias: data.key,
                    },
                    filter,
                  )
                  if (dataSets && dataSets.length > 0 && dataSets[0]) {
                    // 获取默认插值字段
                    let filter2 = {}
                    filter2.typeFilter = [
                      FieldType.INT16,
                      FieldType.INT32,
                      FieldType.INT64,
                      FieldType.SINGLE,
                      FieldType.DOUBLE,
                    ]
                    let fieldInfos = await this.getFieldInfos(
                      {
                        server: this.datasourcePath,
                        engineType: EngineType.UDB,
                        alias: data.key,
                        datasetName: dataSets[0].datasetName,
                      },
                      filter2,
                    )
                    newStateData.interpolationField =
                      fieldInfos && fieldInfos.length > 0 && fieldInfos[0]

                    // 获取默认插值范围
                    let sourceData = {
                      datasource: data.value,
                      dataset: dataSets[0].datasetName,
                    }
                    let bounds = (await SMap.getDatasetBounds(sourceData)) || {}
                    newStateData = Object.assign(newStateData, {
                      left: parseFloat(bounds.left.toFixed(6)),
                      bottom: parseFloat(bounds.bottom.toFixed(6)),
                      right: parseFloat(bounds.right.toFixed(6)),
                      top: parseFloat(bounds.top.toFixed(6)),
                    })
                  } else {
                    newStateData.interpolationField = ''
                  }
                  newStateData.dataSet =
                    dataSets && dataSets.length > 0 && dataSets[0]
                }
                break
              }
              case popTypes.DataSet: {
                newStateData = { dataSet: data }
                if (
                  data &&
                  (!this.state.dataSet ||
                    data.datasetName !== this.state.dataSet.datasetName)
                ) {
                  let sourceData = {
                    datasource: this.state.dataSource.value,
                    dataset: data.value,
                  }
                  // 获取默认插值字段
                  let filter2 = {}
                  filter2.typeFilter = [
                    FieldType.INT16,
                    FieldType.INT32,
                    FieldType.INT64,
                    FieldType.SINGLE,
                    FieldType.DOUBLE,
                  ]
                  let fieldInfos = await this.getFieldInfos(
                    {
                      server: this.datasourcePath,
                      engineType: EngineType.UDB,
                      alias: this.state.dataSource.value,
                      datasetName: data.datasetName,
                    },
                    filter2,
                  )
                  newStateData.interpolationField =
                    fieldInfos && fieldInfos.length > 0 && fieldInfos[0]

                  // 获取默认插值范围
                  let bounds = (await SMap.getDatasetBounds(sourceData)) || {}
                  newStateData = Object.assign(newStateData, {
                    // interpolationField: null,
                    left: bounds.left,
                    bottom: bounds.bottom,
                    right: bounds.right,
                    top: bounds.top,
                  })
                }
                break
              }
              case popTypes.FieldInfos:
                newStateData = { interpolationField: data }
                break
              case popTypes.ResultDataSource:
                newStateData = { resultDataSource: data }
                break
              case popTypes.ResultDataSet:
                newStateData = { resultDataSet: data }
                break
              case popTypes.PixelFormat:
                newStateData = { pixelFormat: data }
                break
            }
            this.setState(newStateData, () => {
              this.popModal && this.popModal.setVisible(false)
            })
          }.bind(this)())
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
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Analyst_Labels.NEXT}
              textStyle={
                this.state.btnAvailable
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={() => {
                if (this.state.btnAvailable) {
                  let data = Object.assign({}, this.state, {
                    resolution: parseFloat(this.state.resolution),
                    top: parseFloat(this.state.top),
                    left: parseFloat(this.state.left),
                    bottom: parseFloat(this.state.bottom),
                    right: parseFloat(this.state.right),
                  })
                  NavigationService.navigate('InterpolationAnalystDetailView', {
                    title: this.state.method.key,
                    data,
                  })
                }
              }}
            />
          ),
        }}
      >
        <KeyboardAvoidingView
          style={{ marginBottom: Const.BOTTOM_HEIGHT }}
          behavior="padding"
          keyboardVerticalOffset={-Const.BOTTOM_HEIGHT}
        >
          <ScrollView
            style={[styles.scrollView, { paddingBottom: -Const.BOTTOM_HEIGHT }]}
          >
            {this.renderMethod()}
            {this.renderSourceData()}
            {this.renderResultData()}
            {this.renderRange()}
          </ScrollView>
        </KeyboardAvoidingView>
        {this.renderPopList()}
      </Container>
    )
  }
}
