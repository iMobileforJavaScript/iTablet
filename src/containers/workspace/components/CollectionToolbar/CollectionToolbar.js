import * as React from 'react'
import { Toast } from '../../../../utils'
import {
  DatasetType,
  Action,
  GPSElementType,
  CursorType,
  SCollector,
  GeoStyle,
  SMCollectorType,
} from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'
import ToolbarList from '../ToolbarList'
import constants from '../../constants'
import PropTypes from 'prop-types'

const POINT = DatasetType.POINT
const LINE = DatasetType.LINE
const REGION = DatasetType.REGION
const CAD = DatasetType.CAD
const TEXT = DatasetType.TEXT

export default class CollectionToolbar extends React.Component {
  static propTypes = {
    type: PropTypes.string,
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
    POP_List: PropTypes.func,
    setLoading: PropTypes.func,
    setSelection: PropTypes.func,
    columns: PropTypes.number,
    style: PropTypes.any,
    separator: PropTypes.number,
  }

  constructor(props) {
    super(props)
    let data = this.getData(props.type)
    this.state = {
      data: data,
      currentOperation: data[0],
      currentIndex: 0, // currentOperation index
      lastIndex: 0, // currentOperation last index
      // currentData: this.getData(props.type || POINT),
      subPopShow: true,
      type: props.type || POINT,
    }
    this.cbData = {}
    this.map = null
    this.startedLoc = false // 是否开启gps定位采集
    this.point2D = {}
    this.operationCallback = () => {} // 当前选择的二级操作的毁掉函数
  }

  componentDidMount() {
    setTimeout(this.createCollector, 2000)
  }

  // componentWillUnmount() {
  //   (async function () {
  //     await SCollector.removeListener()
  //   }).bind(this)()
  // }

  changeTap = async (cbData, type) => {
    this.props.setLoading && this.props.setLoading(true)
    switch (type) {
      case POINT:
        break
      case LINE:
        break
      case REGION:
        break
      case CAD:
        break
    }
    this.operationCallback(true)
    await this.closeLocation()
    await this.props.mapControl.setAction(Action.PAN)
    cbData.callback && (await cbData.callback(true))
    this.setState({
      type: type,
    })
    this.props.setLoading && this.props.setLoading(false)
  }

  createCollector = () => {
    (async function() {
      // if (!this.props.editLayer || !this.props.editLayer.id) return
      // SCollector = await this.props.mapControl.getCollector()
      // let dataset = await this.props.editLayer.layer.getDataset()
      // await SCollector.setDataset(dataset)
      // await SCollector.openGPS()
      // 风格
      let geoStyle = new GeoStyle()
      geoStyle.setPointColor(0, 255, 0)
      //线颜色
      geoStyle.setLineColor(0, 110, 220)
      //面颜色
      geoStyle.setFillForeColor(255, 0, 0)
      //设置绘制风格
      SCollector.setStyle(geoStyle)
      //
      // let style = await SCollector.getStyle()
      // SCollector.setDataset()
    }.bind(this)())
  }

  _collectionChanged = event => {
    if (
      this.startedLoc &&
      this.state.currentOperation &&
      this.state.currentOperation.type.indexOf('gps_path') >= 0
    ) {
      (async function() {
        // TODO 使用 event.x, event.y 来添加点，point2D有时不准确，待修复
        // let result = await SCollector.addGPSPoint(this.props.map, event.point2D)
        let result = await SCollector.addGPSPoint(
          this.props.map,
          event.x,
          event.y,
        )
        if (!result) {
          Toast.show('定位失败')
        }
      }.bind(this)())
    }
    this.point2D = event.point2D
  }

  _onSensorChanged = () => {
    // event
    // Toast.show('==_onSensorChanged==' + event.azimuth)
  }

  toDoAction = () => {
    Toast.show('敬请期待')
  }

  openLocation = async () => {
    try {
      this.startedLoc = true
      this.startedLoc = await SCollector.openGPS()
      await SCollector.setCollectionChangedListener({
        collectionChanged: this._collectionChanged,
        onSensorChanged: this._onSensorChanged,
      })
    } catch (e) {
      Toast.show('定位失败')
    }
  }

  closeLocation = async () => {
    try {
      this.startedLoc = false
      await SCollector.setSingleTapEnable(false)
      await SCollector.closeGPS()
    } catch (e) {
      Toast.show('关闭定位失败')
    }
  }

  /** 采集 开始/结束 **/
  _collect = () => {
    (async function() {
      try {
        await SCollector.startCollect(SMCollectorType.POINT_HAND)
        // this.operationCallback = callback
        // // if (callback && callback()) {
        // switch (type) {
        //   case constants.POINT_HAND:
        //     await SCollector.createElement(GPSElementType.POINT)
        //     await SCollector.setSingleTapEnable(true)
        //     break
        //   case constants.LINE_HAND_POINT:
        //     await SCollector.createElement(GPSElementType.LINE)
        //     await SCollector.setSingleTapEnable(true)
        //     break
        //   case constants.REGION_HAND_POINT:
        //     await SCollector.createElement(GPSElementType.POLYGON)
        //     await SCollector.setSingleTapEnable(true)
        //     break
        //   case constants.LINE_HAND_PATH:
        //     await this.props.mapControl.setAction(Action.FREEDRAW)
        //     break
        //   case constants.REGION_HAND_PATH:
        //     await this.props.mapControl.setAction(Action.DRAWPLOYGON)
        //     break
        //   case constants.POINT_GPS:
        //     await SCollector.createElement(GPSElementType.POINT)
        //     await SCollector.setSingleTapEnable(false)
        //     await this.openLocation()
        //     break
        //   case constants.LINE_GPS_PATH:
        //   case constants.LINE_GPS_POINT:
        //     await SCollector.createElement(GPSElementType.LINE)
        //     await SCollector.setSingleTapEnable(false)
        //     await this.openLocation()
        //     break
        //   case constants.REGION_GPS_PATH:
        //   case constants.REGION_GPS_POINT:
        //     await SCollector.createElement(GPSElementType.POLYGON)
        //     await SCollector.setSingleTapEnable(false)
        //     await this.openLocation()
        //     break
        //   default:
        //     this.toDoAction()
        //     break
        // }
        // } else {
        //   this._cancel(type)
        // }
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  /** 添加点 **/
  _addPoint = async () => {
    // let point = await SCollector.getGPSPoint()
    // let x = await point.getX()
    // let y = await point.getY()
    let result = await SCollector.addGPSPoint()
    if (!result) {
      Toast.show('定位失败')
    }
  }

  /** 记录 **/
  _record = () => {
    this.toDoAction()
  }

  /** 暂停 **/
  _pause = () => {
    this.startedLoc = !this.startedLoc
    if (this.startedLoc) {
      this.openLocation()
    } else {
      this.closeLocation()
    }
    Toast.show(this.startedLoc ? '继续采集' : '暂停采集')
  }

  /** 撤销 **/
  _undo = type => {
    (async function() {
      try {
        switch (type) {
          case constants.LINE_HAND_PATH:
          case constants.REGION_HAND_PATH:
            if (this.props.mapControl) {
              await this.props.mapControl.undo()
            }
            break
          default:
            SCollector && (await SCollector.undo())
            break
        }
        // await this.props.editLayer.layer.setEditable(true)
      } catch (e) {
        Toast.show('重做失败')
      }
    }.bind(this)())
  }

  /** 重做 **/
  _redo = type => {
    (async function() {
      try {
        switch (type) {
          case constants.LINE_HAND_PATH:
          case constants.REGION_HAND_PATH:
            if (this.props.mapControl) {
              await this.props.mapControl.redo()
            }
            break
          default:
            SCollector && (await SCollector.redo())
            break
        }
        // await this.props.editLayer.layer.setEditable(true)
      } catch (e) {
        Toast.show('重做失败')
      }
    }.bind(this)())
  }

  /** 取消 **/
  _cancel = type => {
    (async function() {
      try {
        // switch (type) {
        //   case LINE_HAND_PATH:
        //   case REGION_HAND_PATH:
        //     if (this.props.mapControl) {
        //       await this.props.mapControl.cancel()
        //     }
        //     break
        //   default:
        //     Toast.show('取消采集')
        //     if (this.props.mapControl) {
        //       await this.props.mapControl.cancel()
        //     }
        //     await this.closeLocation()
        //     break
        // }
        switch (type) {
          case constants.POINT_HAND:
            await SCollector.createElement(GPSElementType.POINT)
            await SCollector.setSingleTapEnable(false)
            break
          case constants.LINE_HAND_POINT:
            await SCollector.createElement(GPSElementType.LINE)
            await SCollector.setSingleTapEnable(false)
            break
          case constants.REGION_HAND_POINT:
            await SCollector.createElement(GPSElementType.POLYGON)
            await SCollector.setSingleTapEnable(false)
            break
          case constants.LINE_HAND_PATH:
          case constants.REGION_HAND_PATH:
            if (this.props.mapControl) {
              await this.props.mapControl.cancel()
            }
            break
          case constants.POINT_GPS:
            await SCollector.createElement(GPSElementType.POINT)
            await SCollector.setSingleTapEnable(false)
            await this.closeLocation()
            break
          case constants.LINE_GPS_PATH:
          case constants.LINE_GPS_POINT:
            await SCollector.createElement(GPSElementType.LINE)
            await SCollector.setSingleTapEnable(false)
            await this.closeLocation()
            break
          case constants.REGION_GPS_PATH:
          case constants.REGION_GPS_POINT:
            await SCollector.createElement(GPSElementType.POLYGON)
            await SCollector.setSingleTapEnable(false)
            await this.closeLocation()
            break
          default:
            this.toDoAction()
            break
        }
        this.operationCallback && this.operationCallback(true)
        // await this.props.editLayer.layer.setEditable(true)
      } catch (e) {
        Toast.show('取消失败')
      }
    }.bind(this)())
  }

  /** 保存 **/
  _save = (type, callback = () => {}) => {
    (async function() {
      let result = false
      try {
        switch (type) {
          case constants.LINE_HAND_PATH:
          case constants.REGION_HAND_PATH:
            if (this.props.mapControl) {
              result = await this.props.mapControl.submit()
            }
            break
          case constants.REGION_HAND_POINT:
          case constants.LINE_HAND_POINT:
            if (SCollector) {
              result = await SCollector.submit()
            }
            break
          default:
            if (SCollector) {
              result = await SCollector.submit()
            }
            await this.closeLocation()
            // await SCollector.closeGPS()
            break
        }
        callback && callback(true)
        if (!result) {
          Toast.show('保存失败')
          return
        }
        await this.props.mapControl.setAction(Action.SELECT)
        let selection = await this.props.editLayer.layer.getSelection()
        let ds = await this.props.editLayer.layer.getDataset()
        let recordset = await (await ds.toDatasetVector()).getRecordset(
          false,
          CursorType.DYNAMIC,
        )
        await recordset.moveLast()
        let info = (await recordset.getFieldInfo()) || []
        await selection.clear()
        let smId = null
        for (let i = 0; i < info.length; i++) {
          if (info[i].name === 'SmID' || info[i].name === 'SmID') {
            smId = info[i]
            break
          }
        }
        if (smId) {
          let index = await selection.add(smId.value)
          if (index >= 0) {
            this.props.setSelection &&
              this.props.setSelection({
                id: smId.value,
                layerId: this.props.editLayer.layer._SMLayerId,
                name: this.props.editLayer.name,
                layer: this.props.editLayer.layer,
              })
          }
        }
        await this.props.map.refresh()
        await recordset.dispose()
      } catch (e) {
        Toast.show('保存失败')
      }
    }.bind(this)())
  }

  /** 属性 **/
  _attribute = () => {
    (async function() {
      // let editable = await await this.props.selection.layer.getEditable()
      // if (!editable) {
      if (this.props.selection.layerId !== this.props.editLayer.id) {
        Toast.show('请选择图层' + this.props.editLayer.name + '上的一个对象')
        return
      }
      let selection = await this.props.selection.layer.getSelection()
      let count = await selection.getCount()
      if (count > 0) {
        // NavigationService.navigate('LayerAttribute',{ selection: selection })
        let recordset = await selection.toRecordset()
        NavigationService.navigate('LayerAttribute', { recordset: recordset })
      } else {
        Toast.show('请选择目标')
      }
    }.bind(this)())
  }

  getData = (type = constants.POINT) => {
    let data = [
      {
        key: '开始采集',
        title: '开始采集',
        action: () => this._collect(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_location.png'),
        selectedImage: require('../../../../assets/mapTools/icon_location_selected.png'),
      },
      {
        key: '添加点',
        title: '添加点',
        action: () => this._addPoint(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_add_point.png'),
        selectedImage: require('../../../../assets/mapTools/icon_add_node_seleted.png'),
      },
      {
        key: '撤销',
        title: '撤销',
        action: () => this._undo(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_undo.png'),
        selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'),
        selectMode: 'flash',
      },
      {
        key: '重做',
        title: '重做',
        action: () => this._redo(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_redo.png'),
        selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'),
        selectMode: 'flash',
      },
      {
        key: '取消',
        title: '取消',
        action: () => this._cancel(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_cancel.png'),
        selectedImage: require('../../../../assets/mapTools/icon_cancel_selected.png'),
        selectMode: 'flash',
      },
      {
        key: '提交',
        title: '提交',
        action: () => this._save(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_save.png'),
        selectedImage: require('../../../../assets/mapTools/icon_save_selected.png'),
        selectMode: 'flash',
      },
      {
        key: '编辑',
        title: '编辑',
        action: () => this._attribute(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_attribute.png'),
        selectedImage: require('../../../../assets/mapTools/icon_attribute_selected.png'),
        selectMode: 'flash',
      },
      {
        key: 'GPS式',
        title: 'GPS式',
        action: () => this._attribute(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_attribute.png'),
        selectedImage: require('../../../../assets/mapTools/icon_attribute_selected.png'),
        selectMode: 'flash',
      },
      {
        key: '手绘式',
        title: '手绘式',
        action: () => this._attribute(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_attribute.png'),
        selectedImage: require('../../../../assets/mapTools/icon_attribute_selected.png'),
        selectMode: 'flash',
      },
      {
        key: '打点式',
        title: '打点式',
        action: () => this._attribute(type),
        size: 'large',
        image: require('../../../../assets/mapTools/icon_attribute.png'),
        selectedImage: require('../../../../assets/mapTools/icon_attribute_selected.png'),
        selectMode: 'flash',
      },
    ]

    return data
  }

  checkCurrentOperation = (data = [], currentOperation) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === currentOperation.type) {
        return { currentOperation, currentIndex: i, lastIndex: i }
      }
    }
    return { currentOperation: data[0], currentIndex: 0, lastIndex: 0 }
  }

  _btn_click_manager = ({ item, index }) => {
    item.action &&
      item.action({
        data: item,
        index: index,
        callback: hasChanged => {
          if (hasChanged) {
            this.popList && this.popList.clearOperationRefs()
            this.setState({
              currentOperation: item,
              currentIndex: index,
              lastIndex: index,
            })
          }
        },
      })
  }

  setGridListProps = props => {
    this.popBSL && this.popBSL.setGridListProps(props)
  }

  render() {
    // let data = this.getData(this.props.type)

    return (
      <ToolbarList
        ref={ref => (this.toolbar = ref)}
        style={this.props.style}
        separator={this.props.separator}
        data={this.state.data}
      />
    )
  }
}

export { POINT, LINE, REGION, CAD, TEXT }
