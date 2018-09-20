import * as React from 'react'
import { StyleSheet } from 'react-native'
import { constUtil, Toast, scaleSize } from '../../../../utils'
// import {
//   DatasetType,
//   GeoStyle,
//   Size2D,
//   BufferAnalystGeometry,
//   BufferAnalystParameter,
//   BufferEndType,
//   DatasetVectorInfo,
//   CursorType,
// } from 'imobile_for_javascript'
import { PopBtnSectionList, MTBtn } from '../../../../components'
import { Const } from '../../../../constains'
import { facilityAnalyst, tranportationAnalyst } from '../../util'
import PropTypes from 'prop-types'
// import Setting from '../Setting'
// import NavigationService from '../../../NavigationService'

// const Const.NETWORK_ROUTE = 'route'
// const Const.NETWORK_TSP = 'tsp'
// const Const.NETWORK_FACILITY = 'facility'
// const Const.NETWORK_TRACKING = 'tracking'

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

  // static Type = {
  //   Const.NETWORK_ROUTE: 'route',
  //   Const.NETWORK_TSP: 'tsp',
  //   Const.NETWORK_FACILITY: 'facility',
  //   Const.NETWORK_TRACKING: 'tracking',
  // }

  constructor(props) {
    super(props)
    let {data, currentOperation, currentIndex} = this.getData(props.popType || Const.NETWORK_ROUTE)
    this.state = {
      data: data,                         // 所有数据
      currentOperation: currentOperation, // 当前操作选项
      currentIndex: currentIndex,         // 当前操作选项序号
      lastIndex: currentIndex,            // 上一次操作选项序号
      subPopShow: true,                   // 是否显示子操作栏
      popType: props.popType || Const.NETWORK_ROUTE,    // 操作类型
    }
    this.cbData = {}
  }

  changeTap = async (cbData, type) => {
    this.props.setLoading && this.props.setLoading(true)
    switch (type) {
      case Const.NETWORK_ROUTE:
        // this._transportationLoad()
        break
      case Const.NETWORK_TSP:
        break
      case Const.NETWORK_FACILITY:
        break
      case Const.NETWORK_TRACKING:
        break
    }
    await this.clear(type)
    await this.dispose(type)
    cbData.callback && await cbData.callback(true)
    this.setState({
      popType: type,
      currentIndex: cbData.index,
      currentOperation: cbData.data,
    })
    this.props.setLoading && this.props.setLoading(false)
  }

  toDoAction = () => {
    Toast.show('正在码ing')
  }

  /** 设置 **/
  _setting = type => {
    (async function () {
      this.props.showSetting && this.props.showSetting(type)
      // this.props.showSetting && this.props.showSetting(Setting.Type.NETWORK_TRACKING)
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

  /** 设置配送中心 **/
  _setCenter = type => {
    tranportationAnalyst.setCenter()
  }

  /** 设置目的地 **/
  _setDist = type => {
    tranportationAnalyst.setDist()
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
      case Const.NETWORK_ROUTE:
        await tranportationAnalyst.findPath()
        break
      case Const.NETWORK_FACILITY:
        await facilityAnalyst.connectedAnalyst()
        break
      case Const.NETWORK_TSP:
        await tranportationAnalyst.findMTSPPath()
        break
      case Const.NETWORK_TRACKING:
        break
    }
  }

  clear = async type => {
    // this.toDoAction()
    // await facilityAnalyst.clear()
    switch (type) {
      case Const.NETWORK_TSP:
      case Const.NETWORK_ROUTE:
        await tranportationAnalyst.clear()
        break
      case Const.NETWORK_FACILITY:
      case Const.NETWORK_TRACKING:
        await facilityAnalyst.clear()
        break
    }
  }

  dispose = async type => {
    // this.toDoAction()
    // await facilityAnalyst.clear()
    switch (type) {
      case Const.NETWORK_TSP:
      case Const.NETWORK_ROUTE:
        await tranportationAnalyst.dispose()
        break
      case Const.NETWORK_FACILITY:
      case Const.NETWORK_TRACKING:
        await facilityAnalyst.dispose()
        break
    }
  }

  getData = type => {

    // let data = [
    //   {
    //     key: '路径分析',
    //     type: Const.NETWORK_ROUTE,
    //     action: async cbData => await this.changeTap(cbData, Const.NETWORK_ROUTE),
    //     operations: [
    //       { key: '设置', action: () => this._setting(Const.NETWORK_ROUTE), image: require('../../../../assets/public/save.png') },
    //       { key: '分析', action: () => this._analyst(Const.NETWORK_ROUTE), image: require('../../../../assets/public/save.png') },
    //       { key: '清除', action: () => this.clear(Const.NETWORK_ROUTE), image: require('../../../../assets/public/save.png') },
    //     ],
    //   },
    //   {
    //     key: '连通性分析',
    //     type: Const.NETWORK_FACILITY,
    //     action: async cbData => await this.changeTap(cbData, Const.NETWORK_FACILITY),
    //     operations: [
    //       { key: '设置', action: () => this._setting(Const.NETWORK_FACILITY), image: require('../../../../assets/public/save.png') },
    //       { key: '分析', action: () => this._analyst(Const.NETWORK_FACILITY), image: require('../../../../assets/public/save.png') },
    //       { key: '清除', action: () => this.clear(Const.NETWORK_FACILITY), image: require('../../../../assets/public/save.png') },
    //     ],
    //   },
    //   {
    //     key: '商旅分析',
    //     type: Const.NETWORK_TSP,
    //     action: async cbData => await this.changeTap(cbData, Const.NETWORK_TSP),
    //     operations: [
    //       { key: '设置', action: () => this._setting(Const.NETWORK_TSP), image: require('../../../../assets/public/save.png') },
    //       { key: '添加配送中心', action: () => this._setCenter(Const.NETWORK_TSP), image: require('../../../../assets/public/save.png') },
    //       { key: '添加目的地', action: () => this._setDist(Const.NETWORK_TSP), image: require('../../../../assets/public/save.png') },
    //       { key: '分析', action: () => this._analyst(Const.NETWORK_TSP), image: require('../../../../assets/public/save.png') },
    //       { key: '清除', action: () => this.clear(Const.NETWORK_TSP), image: require('../../../../assets/public/save.png') },
    //     ],
    //   },
    //   {
    //     key: '追踪分析',
    //     type: Const.NETWORK_TRACKING,
    //     action: async cbData => this.changeTap(cbData, Const.NETWORK_TRACKING),
    //     operations: [
    //       { key: '设置', action: () => this._setting(Const.NETWORK_TRACKING), image: require('../../../../assets/public/save.png') },
    //       {
    //         key: '上游追踪', action: () => {
    //           this._traceUp()
    //         }, image: require('../../../../assets/public/save.png'),
    //       },
    //       {
    //         key: '下游追踪', action: () => {
    //           this._traceDown()
    //         }, image: require('../../../../assets/public/save.png'),
    //       },
    //       { key: '清除', action: () => this.clear(Const.NETWORK_TRACKING), image: require('../../../../assets/public/save.png') },
    //     ],
    //   },
    // ]


    let data = [
      {
        key: '路径分析',
        type: Const.NETWORK_ROUTE,
        action: async cbData => await this.changeTap(cbData, Const.NETWORK_ROUTE),
        operations: [
          { key: '设置', action: () => this._setting(Const.NETWORK_ROUTE), size: 'large',image: require('../../../../assets/mapTools/icon_setting.png'), selectedImage: require('../../../../assets/mapTools/icon_setting_selected.png') },
          { key: '分析',action: () => this._analyst(Const.NETWORK_ROUTE), size: 'large', image: require('../../../../assets/mapTools/icon_analysis.png'), selectedImage: require('../../../../assets/mapTools/icon_analysis_seleted.png'), selectMode: 'flash' },
          { key: "清除",action: () => this.clear(Const.NETWORK_ROUTE) , size: 'large', image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
        ]},
      {
        key: '连通性分析',
        type: Const.NETWORK_FACILITY,
        action: async cbData => await this.changeTap(cbData, Const.NETWORK_FACILITY),
        operations: [
          { key: '设置',  action: () => this._setting(Const.NETWORK_FACILITY), size: 'large',image: require('../../../../assets/mapTools/icon_setting.png'), selectedImage: require('../../../../assets/mapTools/icon_setting_selected.png') },
          { key: '分析',action: () => this._analyst(Const.NETWORK_FACILITY), size: 'large', image: require('../../../../assets/mapTools/icon_analysis.png'), selectedImage: require('../../../../assets/mapTools/icon_analysis_seleted.png'), selectMode: 'flash' },
          { key:"清除",action: () => this.clear(Const.NETWORK_FACILITY) , size: 'large', image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
        ],
      },
      {
        key: '商旅分析',
        type: Const.NETWORK_TSP,
        action: async cbData => await this.changeTap(cbData, Const.NETWORK_TSP),
        operations: [
          { key: '设置',  action: () => this._setting(Const.NETWORK_TSP), size: 'large',image: require('../../../../assets/mapTools/icon_setting.png'), selectedImage: require('../../../../assets/mapTools/icon_setting_selected.png') },
          { key: '添加配送中心', action: () => this._setCenter(Const.NETWORK_TSP), image: require('../../../../assets/public/save.png') },
          { key: '添加目的地', action: () => this._setDist(Const.NETWORK_TSP), image: require('../../../../assets/public/save.png') },
          { key: '分析',action: () => this._analyst(Const.NETWORK_TSP), size: 'large', image: require('../../../../assets/mapTools/icon_analysis.png'), selectedImage: require('../../../../assets/mapTools/icon_analysis_seleted.png'), selectMode: 'flash' },
          { key: "清除",action: () => this.clear(Const.NETWORK_TSP) , size: 'large', image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
          
        ],
      },
      {
        key: '追踪分析',
        type: Const.NETWORK_TRACKING,
        action: async cbData => this.changeTap(cbData, Const.NETWORK_TRACKING),
        operations: [
          { key: '设置',  action: () => this._setting(Const.NETWORK_TRACKING), size: 'large',image: require('../../../../assets/mapTools/icon_setting.png'), selectedImage: require('../../../../assets/mapTools/icon_setting_selected.png') },
          { key: '上游追踪',action: () => this._traceUp(), size: 'large', image: require('../../../../assets/mapTools/icon_uptrack.png'), selectedImage: require('../../../../assets/mapTools/icon_uptrack_selected.png'), selectMode: 'flash' },
          { key: '下游追踪',action: this._traceDown(), size: 'large', image: require('../../../../assets/mapTools/icon_downtrack.png'), selectedImage: require('../../../../assets/mapTools/icon_downtrack_selected.png'), selectMode: 'flash' },
          { key: '分析',action: () => this._analyst(Const.NETWORK_TSP), size: 'large', image: require('../../../../assets/mapTools/icon_analysis.png'), selectedImage: require('../../../../assets/mapTools/icon_analysis_seleted.png'), selectMode: 'flash' },
          { key: "清除",action: () => this.clear(Const.NETWORK_TRACKING) , size: 'large', image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },

        ],
      },
    ]
    let currentOperation = null, currentIndex = -1
    if (type) {
      switch (type) {
        case Const.NETWORK_ROUTE:
          currentOperation = data[0]
          currentIndex = 0
          break
        case Const.NETWORK_FACILITY:
          currentOperation = data[1]
          currentIndex = 1
          break
        case Const.NETWORK_TSP:
          currentOperation = data[2]
          currentIndex = 2
          break
        case Const.NETWORK_TRACKING:
          currentOperation = data[3]
          currentIndex = 3
          break
      }
    }
    return {data, currentOperation, currentIndex}
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
        image={require('../../../../assets/map/icon_edit.png')}
        style={{ marginRight: scaleSize(10) }}
        BtnClick={this._analyst}
      />
    )
  }

  render() {
    // let data = this.getData(this.props.editLayer && this.props.editLayer.type >= 0 ? this.props.editLayer.type : DatasetType.POINT)
    return (
      <PopBtnSectionList
        ref={ref => this.popBSL = ref}
        popType={this.state.popType}
        style={styles.pop}
        // subPopShow={this.state.subPopShow}
        subPopShow={true}
        subBtnType={PopBtnSectionList.SubBtnType.IMAGE_BTN}
        // subRight={this.renderSubRight()}
        // data={this.state.data}
        data={this.state.data}
        operationAction={this._btn_click_manager}
        currentOperation={this.state.currentOperation}
        currentIndex={this.state.currentIndex}
        lastIndex={this.state.lastIndex}
      />
    )
  }
}

// NetworkAnalystToolBar.Type = {
//   Const.NETWORK_ROUTE: Const.NETWORK_ROUTE,
//   Const.NETWORK_TSP: Const.NETWORK_TSP,
//   Const.NETWORK_FACILITY: Const.NETWORK_FACILITY,
//   Const.NETWORK_TRACKING: Const.NETWORK_TRACKING,
// }

const styles = StyleSheet.create({
  pop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0.75 * 1.4 * 0.1 * constUtil.WIDTH + 5,
    backgroundColor: 'white',
  },
})