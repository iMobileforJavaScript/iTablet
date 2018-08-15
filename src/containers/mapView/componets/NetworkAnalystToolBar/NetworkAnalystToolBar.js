import * as React from 'react'
import { StyleSheet } from 'react-native'
import { constUtil, Toast, scaleSize } from '../../../../utils'
import {
  DatasetType,
  GeoStyle,
  Size2D,
  BufferAnalystGeometry,
  BufferAnalystParameter,
  BufferEndType,
  DatasetVectorInfo,
  CursorType,
} from 'imobile_for_javascript'
import { PopBtnSectionList, MTBtn } from '../../../../components'
import { facilityAnalyst, tranportationAnalyst } from '../../util'
import PropTypes from 'prop-types'
import Setting from '../Setting'
import NavigationService from '../../../NavigationService'

const ROUTE = 'route'
const TSP = 'tsp'
const FACILITY = 'facility'
const TRACKING = 'tracking'

export default class NetworkAnalystToolBar extends React.Component {

  static propTypes = {
    popType: PropTypes.string,
    mapControl: PropTypes.any,
    mapView: PropTypes.any,
    workspace: PropTypes.any,
    map: PropTypes.any,
    analyst: PropTypes.func,
    subPopShow: PropTypes.bool,
    editLayer: PropTypes.object,
    selection: PropTypes.object,
    showSetting: PropTypes.func,
    chooseLayer: PropTypes.func,
    setLoading: PropTypes.func,
  }

  static Type = {
    ROUTE: 'route',
    TSP: 'tsp',
    FACILITY: 'facility',
    TRACKING: 'tracking',
  }

  constructor(props) {
    super(props)
    let data = this.getData(props.popType || ROUTE)
    this.state = {
      data: data,
      currentOperation: data[0],
      currentIndex: 0,
      lastIndex: 0,
      currentData: this.getData(props.popType || ROUTE),
      subPopShow: true,
      popType: props.popType || ROUTE,
    }
    this.cbData = {}
  }

  changeTap = async (cbData, type) => {
    this.props.setLoading && this.props.setLoading(true)
    switch (type) {
      case ROUTE:
        this._transportationLoad()
        break
      case TSP:
        break
      case FACILITY:
        break
      case TRACKING:
        break
    }
    cbData.callback && await cbData.callback(true)
    this.setState({
      popType: type,
    })
    this.props.setLoading && this.props.setLoading(false)
  }

  toDoAction = () => {
    Toast.show('正在码ing')
  }

  /** 设置 **/
  _setting = type => {
    (async function () {
      // testing
      // let datasource = await this.props.workspace.getDatasource('FacilityNet')
      // // let datasource = await datasources.get('FacilityNet')
      // let dataset = await datasource.getDataset('WaterNet')
      // // let dataset = await datasets.get('WaterNet')
      // let datasetv = await dataset.toDatasetVector()
      //
      // let name = await datasetv.getName()
      //
      // await facilityAnalyst.loadModel(this.props.mapControl, datasetv)
      // this.toDoAction()
      // this.props.showSetting && this.props.showSetting(Setting.Type.NETWORK_TRACKING)
      // this.props.chooseLayer && this.props.chooseLayer(DatasetType.LINE, true)
      // NavigationService.navigate('ChooseEditLayer',{ workspace: this.props.workspace, map: this.props.map, type: DatasetType.LINE, mapControl: this.props.mapControl, isEdit: true })
    }).bind(this)()
  }

  /** 加载网络分析数据 **/
  _transportationLoad = () => {
    this.props.setLoading && this.props.setLoading(true)
    try {
      (async function () {
        // this.toDoAction()
        // testing
        //
        // let datasource = await this.props.workspace.getDatasource(0)
        // let dataset = await datasource.getDataset('RoadNet')
        // let datasetv = await dataset.toDatasetVector()
        //
        // let result = await tranportationAnalyst.loadModel(this.props.mapView, this.props.mapControl, datasetv)
        // this.props.setLoading && this.props.setLoading(false)
        // if (result) {
        //   Toast.show('加载数据成功')
        // } else {
        //   Toast.show('加载数据成功')
        // }
      }).bind(this)()
    } catch (e) {
      this.props.setLoading && this.props.setLoading(false)
    }
  }

  /** 设置起点 **/
  _setStart = type => {
    (async function () {
      await tranportationAnalyst.analyst()
    }).bind(this)()
  }

  /** 设置终点 **/
  _setEnd = type => {
    this.toDoAction()
  }

  /** 添加站点 **/
  _setMiddle = type => {
    this.toDoAction()
  }

  /** 上游追踪 **/
  _traceUp = async () => {
    // this.toDoAction()
    await facilityAnalyst.traceUp()
  }

  /** 下游追踪 **/
  _traceDown = async () => {
    // this.toDoAction()
    await facilityAnalyst.traceDown()
  }

  /** 连通性分析 **/
  _analyst = async type => {
    // this.toDoAction()
    switch (type) {
      case ROUTE:
        break
      case FACILITY:
        await facilityAnalyst.connectedAnalyst()
        break
      case TSP:
        break
      case TRACKING:
        break
    }
  }

  clear = async () => {
    // this.toDoAction()
    await facilityAnalyst.clear()
    // let trackLayer = await this.props.map.getTrackingLayer()
    // await trackLayer.clear()
    // await this.props.map.refresh()
  }

  getData = type => {
    let data = [
      {
        key: '路径分析',
        type: ROUTE,
        action: cbData => {
          this.changeTap(cbData, ROUTE)
        },
        operations: [
          { key: '设置', action: () => this._setting(ROUTE), image: require('../../../../assets/public/save.png') },
          { key: '分析', action: () => this._analyst(ROUTE), image: require('../../../../assets/public/save.png') },
          { key: '清除', action: this.clear, image: require('../../../../assets/public/save.png') },
        ],
      },
      {
        key: '连通性分析',
        type: FACILITY,
        action: cbData => {
          this.changeTap(cbData, FACILITY)
        },
        operations: [
          { key: '设置', action: () => this._setting(FACILITY), image: require('../../../../assets/public/save.png') },
          { key: '分析', action: () => this._analyst(FACILITY), image: require('../../../../assets/public/save.png') },
          { key: '清除', action: this.clear, image: require('../../../../assets/public/save.png') },
        ],
      },
      {
        key: '商旅分析',
        type: TSP,
        action: cbData => {
          this.changeTap(cbData, TSP)
        },
        operations: [
          { key: '设置', action: () => this._setting(TSP), image: require('../../../../assets/public/save.png') },
          { key: '分析', action: () => this._analyst(TSP), image: require('../../../../assets/public/save.png') },
          { key: '清除', action: this.clear, image: require('../../../../assets/public/save.png') },
        ],
      },
      {
        key: '追踪分析',
        type: TRACKING,
        action: cbData => {
          this.changeTap(cbData, TRACKING)
        },
        operations: [
          { key: '设置', action: () => this._setting(TRACKING), image: require('../../../../assets/public/save.png') },
          {
            key: '上游追踪', action: () => {
              this._traceUp()
            }, image: require('../../../../assets/public/save.png'),
          },
          {
            key: '下游追踪', action: () => {
              this._traceDown()
            }, image: require('../../../../assets/public/save.png'),
          },
          { key: '清除', action: this.clear, image: require('../../../../assets/public/save.png') },
        ],
      },
    ]
    if (type) {
      switch (type) {
        case ROUTE:
          data = data[0]
          break
        case FACILITY:
          data = data[1]
          break
        case TSP:
          data = data[2]
          break
        case TRACKING:
          data = data[3]
          break
      }
    }
    return data
  }
  
  _btn_click_manager = ({item, index}) => {
    item.action && item.action({
      data: item,
      index: index,
      callback: hasChanged => {
        if (hasChanged) {
          // this.changeCategorySelected(index)
          // this.operationRefs = [] // 清空二级菜单
          // this.popList && this.popList.changeCategorySelected(index)
          this.popList && this.popList.clearOperationRefs()
          this.setState({
            currentOperation: item,
            currentIndex: index,
            lastIndex: index,
          })
        }
      }})
  }

  renderSubRight = () => {
    return (
      <MTBtn
        BtnText={'分析'}
        BtnImageSrc={require('../../../../assets/map/icon_edit.png')}
        style={{ marginRight: scaleSize(10) }}
        BtnClick={this._analyst}
      />
    )
  }

  render() {
    let data = this.getData(this.props.editLayer && this.props.editLayer.type >= 0 ? this.props.editLayer.type : DatasetType.POINT)
    return (
      <PopBtnSectionList
        ref={ref => this.popBSL = ref}
        popType={this.state.popType}
        style={styles.pop}
        subPopShow={this.state.subPopShow}
        currentData={this.state.currentData}
        subBtnType={PopBtnSectionList.SubBtnType.IMAGE_BTN}
        // subRight={this.renderSubRight()}
        // data={this.state.data}
        data={data}
        operationAction={this._btn_click_manager}
        currentOperation={this.state.currentOperation}
        currentIndex={this.state.currentIndex}
        lastIndex={this.state.lastIndex}
      />
    )
  }
}

NetworkAnalystToolBar.Type = {
  ROUTE: ROUTE,
  TSP: TSP,
  FACILITY: FACILITY,
  TRACKING: TRACKING,
}

const styles = StyleSheet.create({
  pop: {
    position: 'absolute',
    left: 0,
    bottom: 0.75 * 1.4 * 0.1 * constUtil.WIDTH + 5,
    backgroundColor: constUtil.USUAL_GREEN,
  },
})