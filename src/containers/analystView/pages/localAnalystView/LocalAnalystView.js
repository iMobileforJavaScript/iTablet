import React, { Component } from 'react'
import { ConstPath, UserType } from '../../../../constants'
import { Container, LinkageList } from '../../../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { Toast, AnalystTools } from '../../../../utils'
import { FileTools } from '../../../../native'
import { Analyst_Types } from '../../AnalystType'
import NavigationService from '../../../NavigationService'
import TabNavigationService from '../../../TabNavigationService'
import {
  SMap,
  EngineType,
  DatasetType,
  // SFacilityAnalyst,
  STransportationAnalyst,
} from 'imobile_for_reactnative'

export default class LocalAnalystView extends Component {
  props: {
    language: String,
    nav: Object,
    navigation: Object,
    currentUser: Object,
    device: Object,
    getLayers: () => {},
    setAnalystParams: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.type = params && params.type
    this.cb = params && params.cb

    let title = ''
    switch (this.type) {
      case Analyst_Types.OPTIMAL_PATH:
        title = getLanguage(this.props.language).Analyst_Modules.OPTIMAL_PATH
        break
      case Analyst_Types.CONNECTIVITY_ANALYSIS:
        title = getLanguage(this.props.language).Analyst_Modules
          .CONNECTIVITY_ANALYSIS
        break
      case Analyst_Types.FIND_TSP_PATH:
        title = getLanguage(this.props.language).Analyst_Modules.FIND_TSP_PATH
        break
    }

    this.state = {
      title,
      dataSourceAndSets: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  // componentDidUpdate(prevProps, prevState) {}

  getData = () => {
    (async function() {
      this.setLoading(true, getLanguage(this.props.language).Prompt.LOADING)
      try {
        let dataSourceAndSets = []
        let data = await this.getDatasources()
        for (let i = 0; i < data.length; i++) {
          let dataSource = data[i]
          let alias = dataSource.path.substr(
            dataSource.path.lastIndexOf('/') + 1,
            dataSource.path.lastIndexOf('.') -
              dataSource.path.lastIndexOf('/') -
              1,
          )
          let udbPath = await FileTools.appendingHomeDirectory(dataSource.path)
          let datasets = await SMap.getDatasetsByExternalDatasource({
            server: udbPath,
            alias: alias,
            engineType: EngineType.UDB,
          })

          let dss = []
          for (let j = 0; j < datasets.length; j++) {
            if (datasets[j].datasetType === DatasetType.Network) {
              datasets[j].title = datasets[j].datasetName
              datasets[j].parentTitle = datasets[j].datasourceName
              dss.push(datasets[j])
            }
          }

          if (dss.length > 0) {
            dataSourceAndSets.push({
              title: alias,
              server: udbPath,
              engineType: EngineType.UDB,
              data: dss,
            })
          }
        }

        this.setState(
          {
            dataSourceAndSets,
          },
          () => {
            this.setLoading(false)
          },
        )
      } catch (e) {
        this.setLoading(false)
      }
    }.bind(this)())
  }

  // 获取数据源
  getDatasources = async () => {
    let udbPath = ''
    if (
      this.props.currentUser.userName &&
      this.props.currentUser.userType !== UserType.PROBATION_USER
    ) {
      udbPath =
        (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
        this.props.currentUser.userName +
        '/' +
        ConstPath.RelativePath.Datasource
    } else {
      udbPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      )
    }

    let udbs = await FileTools.getPathListByFilter(udbPath, {
      extension: 'udb',
      type: 'file',
    })
    return udbs
  }

  // 获取所有数据集
  getDatasets = async ({ data }) => {
    let result = data
    let index = 0
    let dataset
    for (let item of data) {
      let datasets = []
      dataset = await SMap.getDatasetsByDatasource(
        {
          server: item.server,
          engineType: item.engineType,
          alias: item.title,
        },
        false,
      )

      dataset.list.map(val => {
        let obj = {}
        obj.title = val.datasetName
        obj.parentTitle = val.datasourceName
        datasets.push(obj)
      })
      result[index++].data = datasets
    }
    return result
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  listRightAction = ({ parent, item }) => {
    (async function() {
      try {
        let params1 =
          this.props.nav.routes[this.props.nav.index - 1].params || {}
        let params2 = this.props.navigation.state.params || {}
        this.setLoading(
          true,
          getLanguage(this.props.language).Analyst_Prompt.LOADING_MODULE,
        )
        let { result, layerInfo } = await STransportationAnalyst.load(
          {
            alias: parent.title,
            server: parent.server,
            engineType: parent.engineType,
          },
          {
            networkDataset: item.datasetName,
            weightFieldInfos: [
              {
                name: 'length',
                ftWeightField: 'smLength',
                tfWeightField: 'smLength',
              },
            ],
            edgeNameField: 'roadName',
            weightName: 'length',
            // edgeIDField: 'SmEdgeID',
            // nodeIDField: 'SmNodeID',
            tolerance: 89,
            // fNodeIDField: 'SmFNode',
            // tNodeIDField: 'SmTNode',
            // directionField: 'Name',
          },
        )
        if (result) {
          this.props.setAnalystParams({
            ...params2,
          })
          await AnalystTools.clear(this.type)
          this.setLoading(false)
          await SMap.setLayerFullView(layerInfo.path)
          NavigationService.goBack('AnalystListEntry')
          TabNavigationService.navigate('MapAnalystView', {
            backAction: () => {
              this.props.setAnalystParams(null)
              TabNavigationService.navigate('AnalystTools')
              NavigationService.navigate('AnalystListEntry', {
                ...params1,
              })
              NavigationService.navigate('LocalAnalystView', { ...params2 })
            },
          })
        } else {
          this.setLoading(false)
        }
      } catch (e) {
        this.setLoading(false)
        Toast.show(
          getLanguage(this.props.language).Analyst_Prompt.LOADING_MODULE_FAILED,
        )
      }
    }.bind(this)())
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
        <LinkageList
          language={this.props.language}
          data={this.state.dataSourceAndSets}
          titles={[
            getLanguage(this.props.language).Analyst_Labels.DATA_SOURCE,
            getLanguage(this.props.language).Analyst_Labels.DATA_SET,
          ]}
          onRightPress={this.listRightAction}
        />
      </Container>
    )
  }
}
