import React, { Component } from 'react'
import {
  ConstPath,
  UserType,
  ToolbarType,
  ConstToolType,
} from '../../../../constants'
import { Container, LinkageList } from '../../../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { Toast, AnalystTools } from '../../../../utils'
import { FileTools } from '../../../../native'
// import { Analyst_Types } from '../../AnalystType'
import NavigationService from '../../../NavigationService'
import { ToolbarModule } from '../../../workspace/components/ToolBar/modules'
// import TabNavigationService from '../../../TabNavigationService'
import {
  SMap,
  SFacilityAnalyst,
  STransportationAnalyst,
} from 'imobile_for_reactnative'

export default class LocalAnalystView extends Component {
  props: {
    language: String,
    nav: Object,
    navigation: Object,
    currentUser: Object,
    device: Object,
    userUdbAndDs: Array,
    getLayers: () => {},
    setAnalystParams: () => {},
    getUdbAndDs: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.type = params && params.type
    this.cb = params && params.cb
    this.reloadData = true
    if (params && params.reloadData !== undefined) {
      this.reloadData = params.reloadData
    }

    let title = ''
    switch (this.type) {
      case ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH:
        title = getLanguage(this.props.language).Analyst_Modules.OPTIMAL_PATH
        break
      case ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
        title = getLanguage(this.props.language).Analyst_Modules
          .CONNECTIVITY_ANALYSIS
        break
      case ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH:
        title = getLanguage(this.props.language).Analyst_Modules.FIND_TSP_PATH
        break
    }

    this.state = {
      title,
      dataSourceAndSets: [],
    }
  }

  componentDidMount() {
    if (this.reloadData || this.props.userUdbAndDs.length === 0) {
      this.getData()
    }
  }

  getData = () => {
    (async function() {
      this.setLoading(true, getLanguage(this.props.language).Prompt.LOADING)
      try {
        await this.props.getUdbAndDs({
          userName: this.props.currentUser.userName,
        })
        this.setLoading(false)
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

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  listRightAction = ({ parent, item }) => {
    (async function() {
      try {
        // let params1 =
        //   this.props.nav.routes[this.props.nav.index - 1].params || {}
        let params2 = this.props.navigation.state.params || {}
        this.setLoading(
          true,
          getLanguage(this.props.language).Analyst_Prompt.LOADING_MODULE,
        )

        let res
        // if (this.type === ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS) {
        //   res = await this.loadFacility({ parent, item })
        // } else {
        res = await this.loadTransport({ parent, item })
        // }

        if (res.result) {
          ToolbarModule.addData({
            navigationParams: params2,
            backAction: () => {
              AnalystTools.clear(this.type)
              ToolbarModule.getData().navigationParams &&
                delete ToolbarModule.getData().navigationParams
              NavigationService.navigate('LocalAnalystView', {
                ...params2,
                reloadData: false,
              })
            },
          })
          // this.props.setAnalystParams({
          //   ...params2,
          //   backAction: () => {
          //     AnalystTools.clear(this.type)
          //     this.props.setAnalystParams(null)
          //     NavigationService.navigate('LocalAnalystView', {
          //       ...params2,
          //       reloadData: false,
          //     })
          //   },
          // })
          ToolbarModule.getParams().setToolbarVisible(true, this.type, {
            containerType: ToolbarType.table,
            isFullScreen: false,
            height: ConstToolType.HEIGHT[0],
          })
          await AnalystTools.clear(this.type)
          await this.props.getLayers()
          this.setLoading(false)
          await SMap.setLayerFullView(res.layerInfo.path)
          NavigationService.goBack()
        } else {
          this.setLoading(false)
          Toast.show(
            getLanguage(this.props.language).Analyst_Prompt
              .LOADING_MODULE_FAILED,
          )
        }
      } catch (e) {
        this.setLoading(false)
        Toast.show(
          getLanguage(this.props.language).Analyst_Prompt.LOADING_MODULE_FAILED,
        )
      }
    }.bind(this)())
  }

  loadFacility = async ({ parent, item }) => {
    let data = await SFacilityAnalyst.load(
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
        // edgeNameField: 'roadName',
        weightName: 'length',
        // edgeIDField: 'SmEdgeID',
        // nodeIDField: 'SmNodeID',
        tolerance: 89,
        // fNodeIDField: 'SmFNode',
        // tNodeIDField: 'SmTNode',
        // directionField: 'Direction',
      },
    )
    return data
  }

  loadTransport = async ({ parent, item }) => {
    let data = await STransportationAnalyst.load(
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
        // edgeNameField: 'Name',
        edgeNameField: 'roadName',
        // edgeNameField: 'roadName',
        nodeNameField: 'SmNodeID',
        weightName: 'length',
        // edgeIDField: 'SmEdgeID',
        // nodeIDField: 'SmNodeID',
        tolerance: 89,
        // fNodeIDField: 'SmFNode',
        // tNodeIDField: 'SmTNode',
        // directionField: 'Name',
      },
    )
    return data
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
          // data={this.state.dataSourceAndSets}
          adjustmentWidth={true}
          data={this.props.userUdbAndDs}
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
