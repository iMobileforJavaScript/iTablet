import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { constUtil, Toast } from '../../../../utils'
import {
  DatasetType,
  Action,
  GeoStyle,
  GPSElementType,
  CursorType,
} from 'imobile_for_javascript'
import { PopBtnSectionList, MTBtn } from '../../../../components'
import NavigationService from '../../../NavigationService'
import PropTypes from 'prop-types'

const POINT = DatasetType.POINT
const LINE = DatasetType.LINE
const REGION = DatasetType.REGION
const CAD = DatasetType.CAD
const TEXT = DatasetType.TEXT

const POINT_GPS = 'point_gps'
const POINT_HAND = 'point_hand'

const LINE_GPS_POINT = 'line_gps_point'
const LINE_GPS_PATH = 'line_gps_path'
const LINE_HAND_POINT = 'line_hand_point'
const LINE_HAND_PATH = 'line_hand_path'

const REGION_GPS_POINT = 'region_gps_point'
const REGION_GPS_PATH = 'region_gps_path'
const REGION_HAND_POINT = 'region_hand_point'
const REGION_HAND_PATH = 'region_hand_path'

const CAD_POINT = 'cad_point'
const CAD_LINE = 'cad_line'
const CAD_REGION = 'cad_region'


export default class CollectionToolBar extends React.Component {

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
    POP_List: PropTypes.func,
    setLoading: PropTypes.func,
    setSelection: PropTypes.func,
  }

  constructor(props) {
    super(props)
    let data = this.getData(this.props.editLayer && this.props.editLayer.type >= 0 ? this.props.editLayer.type : DatasetType.POINT)
    this.state = {
      data: data,
      currentOperation: data[0],
      currentIndex: 0,  // currentOperation index
      lastIndex: 0,     // currentOperation last index
      // currentData: this.getData(props.popType || POINT),
      subPopShow: true,
      popType: props.popType || POINT,
    }
    this.cbData = {}
    this.collector = null
    this.map = null
  }

  componentDidMount() {
    this.createCollector()
  }

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
    cbData.callback && await cbData.callback(true)
    this.setState({
      popType: type,
    })
    this.props.setLoading && this.props.setLoading(false)
  }

  createCollector = async () => {
    if (!this.props.editLayer || !this.props.editLayer.id || this.collector) return
    this.collector = await this.props.mapControl.getCollector()
    let dataset = await this.props.editLayer.layer.getDataset()
    await this.collector.setDataset(dataset)
    await this.collector.openGPS()
    //风格
    let geoStyle = await new GeoStyle().createObj()
    //线颜色
    await geoStyle.setLineColor(0, 110, 220)
    //面颜色
    await geoStyle.setFillForeColor(255, 0, 0)
    //设置绘制风格
    await this.collector.setStyle(geoStyle)
  }

  // 手绘采集
  handCollect = type => {
    (async function () {
      try {
        switch (type) {
          case POINT_HAND:
            // await this.props.mapControl.setAction(Action.CREATEPOINT)
            await this.collector.createElement(GPSElementType.POINT)
            await this.collector.setSingleTapEnable(true)
            break
          case LINE_HAND_POINT:
            await this.collector.createElement(GPSElementType.LINE)
            // await this.props.mapControl.setAction(Action.CREATEPOLYLINE)
            await this.collector.setSingleTapEnable(true)
            break
          case REGION_HAND_POINT:
            await this.collector.createElement(GPSElementType.POLYGON)
            // await this.props.mapControl.setAction(Action.CREATEPOLYGON)
            await this.collector.setSingleTapEnable(true)
            break
          case LINE_HAND_PATH:
            // await this.collector.createElement(GPSElementType.LINE)
            await this.props.mapControl.setAction(Action.FREEDRAW)
            // await this.collector.setSingleTapEnable(false)
            break
          case REGION_HAND_PATH:
            // await this.collector.createElement(GPSElementType.POLYGON)
            await this.props.mapControl.setAction(Action.DRAWPLOYGON)
            // await this.collector.setSingleTapEnable(false)
            break
        }
        Toast.show('开始采集')
      } catch (e) {
        Toast.show('采集失败')
      }
    }).bind(this)()
  }

  // GPS采集
  gpsCollect = async () => {
    try {
      let dataset = await this.props.editLayer.layer.getDataset()
      // this.collector = await this.props.mapControl.getCollector()
      await this.collector.setDataset(dataset)

      // 风格
      let geoStyle = await new GeoStyle().createObj()
      // 线颜色
      await geoStyle.setLineColor(0, 110, 220)
      // 面颜色
      await geoStyle.setFillForeColor(160, 255, 90)
      // 设置绘制风格
      await this.collector.setStyle(geoStyle)

      // 打开单指打点,默认不打开
      // collector.setSingleTapEnable(true)
      // 添加定位变化监听
      await this.collector.setCollectionChangedListener({
        collectionChanged: this._collectionChanged,
      })
      this.props.setLoading && this.props.setLoading(false)
    } catch (e) {
      console.error(e)
      this.props.setLoading && this.props.setLoading(false)
    }
  }

  _addGestureDetector = async () => {
    await this.props.mapControl.setGestureDetector({
      touchBeganHandler: this._touchBeganHandler,
    })
  }

  _touchBeganHandler = async event => {
    // try {
    //   await this.props.mapControl.onMultiTouch(event)
    //
    //   let action = await event.getAction()
    //
    //   // 绘制完点对象，自动提交
    //   if(action === MotionEvent.ACTION_UP){
    //     let currentGeometry = await this.props.mapControl.getCurrentGeometry()
    //     let type = await currentGeometry.getType()
    //     if (currentGeometry !== null &&type === GeometryType.GEOPOINT) {
    //
    //       mMapControl.submit()
    //
    //       return true
    //     }
    //   }
    // } catch (e) {
    //
    // }
  }

  _collectionChanged = event => {
    // event.x
    // event.y
    // event.dAccuracy
  }

  toDoAction = () => {
    Toast.show('敬请期待')
  }

  /** 采集 开始/结束 **/
  _collect = type => {
    (async function () {
      // let action = await this.props.mapControl.getAction()
      // let isSingleTapEnable = await this.collector.IsSingleTapEnable()
      //
      // if (isSingleTapEnable) {
      //   await this.collector.setSingleTapEnable(false)
      //   Toast.show('停止采集')
      // } else {
      //   await this.collector.setSingleTapEnable(true)
      //   Toast.show('开始采集')
      // }
      // this.props.mapControl.setAction(Action.PAN)

      // if (action === Action.SELECT) { // 结束采集
      //   // await this.props.mapControl.setAction(Action.PAN)
      //   await this.collector.setSingleTapEnable(false)
      // } else { // 开始采集
      //   await this.collector.createElement(GPSElementType.LINE)
      //   // await this.props.mapControl.setAction(Action.SELECT)
      //   await this.collector.setSingleTapEnable(true)
      // }
      // let map = await this.props.mapControl.getMap()
      // await this.props.map.refresh()
      try {
        switch (type) {
          case POINT_HAND:
          case LINE_HAND_POINT:
          case REGION_HAND_POINT:
          case LINE_HAND_PATH:
          case REGION_HAND_PATH:
            await this.handCollect(type)
            break
          default:
            this.toDoAction()
            break
        }
        // await this.props.editLayer.layer.setEditable(true)
      } catch (e) {
        console.error(e)
      }

    }).bind(this)()
  }

  /** CAD 点绘式 **/
  _drawPoint = type => {
    this.toDoAction()
  }

  /** CAD 自由式 **/
  _freeStyle = type => {
    this.toDoAction()
  }

  /** 添加点 **/
  _addPoint = type => {
    this.toDoAction()
  }

  /** 记录 **/
  _record = type => {
    this.toDoAction()
  }

  /** 暂停 **/
  _pause = type => {
    this.toDoAction()
  }

  /** 撤销 **/
  _undo = type => {
    (async function () {
      try {
        switch (type) {
          case LINE_HAND_PATH:
          case REGION_HAND_PATH:
            if (this.props.mapControl) {
              await this.props.mapControl.undo()
            }
            break
          default:
            this.collector && await this.collector.undo()
            break
        }
        // await this.props.editLayer.layer.setEditable(true)
      } catch (e) {
        Toast.show('重做失败')
      }
    }).bind(this)()
  }

  /** 重做 **/
  _redo = type => {
    (async function () {
      try {
        switch (type) {
          case LINE_HAND_PATH:
          case REGION_HAND_PATH:
            if (this.props.mapControl) {
              await this.props.mapControl.redo()
            }
            break
          default:
            this.collector && await this.collector.redo()
            break
        }
        // await this.props.editLayer.layer.setEditable(true)
      } catch (e) {
        Toast.show('重做失败')
      }
    }).bind(this)()
  }

  /** 取消 **/
  _cancel = type => {
    (async function () {
      try {
        switch (type) {
          case LINE_HAND_PATH:
          case REGION_HAND_PATH:
            if (this.props.mapControl) {
              await this.props.mapControl.cancel()
            }
            break
          default:
            this.collector && await this.collector.cancel()
            break
        }
        // await this.props.editLayer.layer.setEditable(true)
      } catch (e) {
        Toast.show('取消失败')
      }
    }).bind(this)()
  }

  /** 保存 **/
  _save = type => {
    (async function () {
      try {
        switch (type) {
          case LINE_HAND_PATH:
          case REGION_HAND_PATH:
            if (this.props.mapControl) {
              await this.props.mapControl.submit()
            }
            break
          default:
            this.collector && await this.collector.submit()
            break
        }
        await this.props.mapControl.setAction(Action.SELECT)
        let selection = await this.props.editLayer.layer.getSelection()
        let ds = await this.props.editLayer.layer.getDataset()
        let recordset = await (await ds.toDatasetVector()).getRecordset(false, CursorType.DYNAMIC)
        await recordset.moveLast()
        let info = await recordset.getFieldInfo()
        await selection.clear()
        let index = await selection.add(info['SMID'].value)
        if (index >= 0) {
          this.props.setSelection && this.props.setSelection({
            id: info['SMID'].value,
            layerId: this.props.editLayer.layer._SMLayerId,
            name: this.props.editLayer.name,
            layer: this.props.editLayer.layer,
          })
        }
        await recordset.dispose()
      } catch (e) {
        Toast.show('保存失败')
      }
    }).bind(this)()
  }

  /** 属性 **/
  _attribute = () => {
    (async function() {
      let editable = await await this.props.selection.layer.getEditable()
      if (!editable) {
        Toast.show('请选择图层' + this.props.editLayer.name + '上的一个对象')
        return
      }
      let selection = await this.props.selection.layer.getSelection()
      let count  = await selection.getCount()
      if (count > 0) {
        // NavigationService.navigate('LayerAttribute',{ selection: selection })
        NavigationService.navigate('LayerAttribute',{ recordset: selection.recordset })
      } else {
        Toast.show('请选择目标')
      }
    }.bind(this)())
  }

  /** 切换图层 **/
  _changeLayer = async () => {
    this.props.chooseLayer && this.props.chooseLayer(-1, true, () => { // 传 -1 查询所有类型的图层
      if (this.props.POP_List) {
        this.props.POP_List(true, 'collection')
      }
    })
  }

  getData = (type = DatasetType.POINT) => {
    let data = []
    switch (type) {
      case POINT:
        data = [
          {
            key: 'GPS式',
            type: POINT_GPS,
            action: cbData => {
              this.changeTap(cbData, POINT_GPS)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(POINT_GPS) },
              { key: '添加点', action: () => this._addPoint(POINT_GPS) },
              { key: '属性', action: () => this._attribute(POINT_GPS) },
            ],
          },
          {
            key: '手绘式',
            type: POINT_HAND,
            action: cbData => {
              this.changeTap(cbData, POINT_HAND)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(POINT_HAND) },
              { key: '属性', action: () => this._attribute(POINT_HAND) },
            ],
          },
        ]
        break
      case LINE:
        data = [
          {
            key: 'GPS-打点式',
            type: LINE_GPS_POINT,
            action: cbData => {
              this.changeTap(cbData, LINE_GPS_POINT)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(LINE_GPS_POINT) },
              { key: '添加点', action: () => this._addPoint(LINE_GPS_POINT) },
              { key: '撤销', action: () => this._undo(LINE_GPS_POINT) },
              { key: '重做', action: () => this._redo(LINE_GPS_POINT) },
              { key: '取消', action: () => this._cancel(LINE_GPS_POINT) },
              { key: '保存', action: () => this._save(LINE_GPS_POINT) },
              { key: '属性', action: () => this._attribute(LINE_GPS_POINT) },
            ],
          },
          {
            key: 'GPS-轨迹式',
            type: LINE_GPS_PATH,
            action: cbData => {
              this.changeTap(cbData, LINE_GPS_PATH)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(LINE_GPS_PATH) },
              // { key: '记录', action: this._record },
              { key: '暂停', action: () => this._pause(LINE_GPS_POINT) },
              { key: '取消', action: () => this._cancel(LINE_GPS_PATH) },
              { key: '保存', action: () => this._save(LINE_GPS_PATH) },
              { key: '属性', action: () => this._attribute(LINE_GPS_PATH) },
            ],
          },
          {
            key: '手绘-打点式',
            type: LINE_HAND_POINT,
            action: cbData => {
              this.changeTap(cbData, LINE_HAND_POINT)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(LINE_HAND_POINT) },
              { key: '撤销', action: () => this._undo(LINE_HAND_POINT) },
              { key: '重做', action: () => this._redo(LINE_HAND_POINT) },
              { key: '取消', action: () => this._cancel(LINE_HAND_POINT) },
              { key: '保存', action: () => this._save(LINE_HAND_POINT) },
              { key: '属性', action: () => this._attribute(LINE_HAND_POINT) },
            ],
          },
          {
            key: '手绘-轨迹式',
            type: LINE_HAND_PATH,
            action: cbData => {
              this.changeTap(cbData, LINE_HAND_PATH)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(LINE_HAND_PATH) },
              { key: '撤销', action: () => this._undo(LINE_HAND_PATH) },
              { key: '重做', action: () => this._redo(LINE_HAND_PATH) },
              { key: '取消', action: () => this._cancel(LINE_HAND_PATH) },
              { key: '保存', action: () => this._save(LINE_HAND_PATH) },
              { key: '属性', action: () => this._attribute(LINE_HAND_PATH) },
            ],
          },
        ]
        break
      case REGION:
        data = [
          {
            key: 'GPS-打点式',
            type: REGION_GPS_POINT,
            action: cbData => {
              this.changeTap(cbData, REGION_GPS_POINT)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(REGION_GPS_POINT) },
              { key: '添加点', action: () => this._addPoint(REGION_GPS_POINT) },
              { key: '撤销', action: () => this._undo(REGION_GPS_POINT) },
              { key: '重做', action: () => this._redo(REGION_GPS_POINT) },
              { key: '取消', action: () => this._cancel(REGION_GPS_POINT) },
              { key: '保存', action: () => this._save(REGION_GPS_POINT) },
              { key: '属性', action: () => this._attribute(REGION_GPS_POINT) },
            ],
          },
          {
            key: 'GPS-轨迹式',
            type: REGION_GPS_PATH,
            action: cbData => {
              this.changeTap(cbData, REGION_GPS_PATH)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(REGION_GPS_PATH) },
              // { key: '记录', action: this._record },
              { key: '暂停', action: () => this._pause(REGION_GPS_PATH) },
              { key: '取消', action: () => this._cancel(REGION_GPS_PATH) },
              { key: '保存', action: () => this._save(REGION_GPS_PATH) },
              { key: '属性', action: () => this._attribute(REGION_GPS_PATH) },
            ],
          },
          {
            key: '手绘-打点式',
            type: REGION_HAND_POINT,
            action: cbData => {
              this.changeTap(cbData, REGION_HAND_POINT)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(REGION_HAND_POINT) },
              { key: '撤销', action: () => this._undo(REGION_HAND_POINT) },
              { key: '重做', action: () => this._redo(REGION_HAND_POINT) },
              { key: '取消', action: () => this._cancel(REGION_HAND_POINT) },
              { key: '保存', action: () => this._save(REGION_HAND_POINT) },
              { key: '属性', action: () => this._attribute(REGION_HAND_POINT) },
            ],
          },
          {
            key: '手绘-轨迹式',
            type: REGION_HAND_PATH,
            action: cbData => {
              this.changeTap(cbData, REGION_HAND_PATH)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(REGION_HAND_PATH) },
              { key: '撤销', action: () => this._undo(REGION_HAND_PATH) },
              { key: '重做', action: () => this._redo(REGION_HAND_PATH) },
              { key: '取消', action: () => this._cancel(REGION_HAND_PATH) },
              { key: '保存', action: () => this._save(REGION_HAND_PATH) },
              { key: '属性', action: () => this._attribute(REGION_HAND_PATH) },
            ],
          },
        ]
        break
      // case CAD:
      //   data = [
      //     {
      //       key: '涂鸦点',
      //       type: CAD_POINT,
      //       action: cbData => {
      //         this.changeTap(cbData, CAD_POINT)
      //       },
      //       operations: [
      //         { key: '开始采集', action: () => this._collect(CAD_POINT) },
      //         { key: '撤销', action: () => this._undo(LINE_GPS_POINT) },
      //         { key: '重做', action: () => this._redo(LINE_GPS_POINT) },
      //         { key: '取消', action: () => this._cancel(CAD_POINT) },
      //         { key: '保存', action: () => this._save(CAD_POINT) },
      //       ],
      //     },
      //     {
      //       key: '涂鸦线',
      //       type: CAD_LINE,
      //       action: cbData => {
      //         this.changeTap(cbData, CAD_LINE)
      //       },
      //       operations: [
      //         { key: '开始采集', action: () => this._collect(CAD_LINE) },
      //         { key: '点绘式', action: () => this._drawPoint(CAD_LINE) },
      //         { key: '自由式', action: () => this._freeStyle(CAD_LINE) },
      //         { key: '撤销', action: () => this._undo(LINE_GPS_POINT) },
      //         { key: '重做', action: () => this._redo(LINE_GPS_POINT) },
      //         { key: '取消', action: () => this._cancel(CAD_LINE) },
      //         { key: '保存', action: () => this._save(CAD_LINE) },
      //       ],
      //     },
      //     {
      //       key: '涂鸦面',
      //       type: CAD_REGION,
      //       action: cbData => {
      //         this.changeTap(cbData, CAD_REGION)
      //       },
      //       operations: [
      //         { key: '开始采集', action: () => this._collect(CAD_REGION) },
      //         { key: '点绘式', action: () => this._drawPoint(CAD_REGION) },
      //         { key: '自由式', action: () => this._freeStyle(CAD_REGION) },
      //         { key: '撤销', action: () => this._undo(LINE_GPS_POINT) },
      //         { key: '重做', action: () => this._redo(LINE_GPS_POINT) },
      //         { key: '取消', action: () => this._cancel(CAD_REGION) },
      //         { key: '保存', action: () => this._save(CAD_REGION) },
      //       ],
      //     },
      //   ]
      //   break
      case TEXT:
        data = [
          {
            key: '文本',
            type: TEXT,
            action: cbData => {
              this.changeTap(cbData, TEXT)
            },
            operations: [
              { key: '开始采集', action: () => this._collect(TEXT) },
              { key: '撤销', action: () => this._undo(LINE_GPS_POINT) },
              { key: '重做', action: () => this._redo(LINE_GPS_POINT) },
              { key: '取消', action: () => this._cancel(TEXT) },
              { key: '保存', action: () => this._save(TEXT) },
              { key: '属性', action: () => this._attribute(TEXT) },
            ],
          },
        ]
        break
    }
    return data
  }

  checkCurrentOperation = (data = [], currentOperation) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === currentOperation.type) {
        return {currentOperation, currentIndex: i, lastIndex: i}
      }
    }
    return {currentOperation: data[0], currentIndex: 0, lastIndex: 0}
  }

  _btn_click_manager = ({item, index}) => {
    item.action && item.action({
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
      }})
  }

  render() {
    let data = this.getData(this.props.editLayer && this.props.editLayer.type >= 0 ? this.props.editLayer.type : DatasetType.POINT)
    let {currentOperation, currentIndex, lastIndex} = this.checkCurrentOperation(data, this.state.currentOperation)
    return (
      <View style={styles.popView}>
        <MTBtn style={styles.changeLayerBtn} BtnImageSrc={require('../../../../assets/map/icon-layer-change.png')} BtnClick={this._changeLayer} />
        <PopBtnSectionList
          ref={ref => this.popBSL = ref}
          popType={this.state.popType}
          style={styles.pop}
          subPopShow={this.state.subPopShow}
          currentData={this.props.editLayer}
          subBtnType={PopBtnSectionList.SubBtnType.TEXT_BTN}
          // currentOperation={}
          // data={this.state.data}
          operationAction={this._btn_click_manager}
          data={data}
          currentOperation={currentOperation}
          currentIndex={currentIndex}
          lastIndex={lastIndex}
        />
      </View>
    )
  }
}

CollectionToolBar.Type = {
  POINT: DatasetType.POINT,
  LINE: DatasetType.LINE,
  REGION: DatasetType.REGION,
  CAD: DatasetType.CAD,
  TEXT: DatasetType.TEXT,
}

CollectionToolBar.OperationType = {
  POINT_GPS: POINT_GPS,
  POINT_HAND: POINT_HAND,
  LINE_GPS_PATH: LINE_GPS_PATH,
  LINE_GPS_POINT: LINE_GPS_POINT,
  LINE_HAND_PATH: LINE_HAND_PATH,
  LINE_HAND_POINT: LINE_HAND_POINT,
  REGION_GPS_PATH: REGION_GPS_PATH,
  REGION_GPS_POINT: REGION_GPS_POINT,
  REGION_HAND_PATH: REGION_HAND_PATH,
  REGION_HAND_POINT: REGION_HAND_POINT,
  CAD_LINE: CAD_LINE,
  CAD_POINT: CAD_POINT,
  CAD_REGION: CAD_REGION,
  TEXT: TEXT,
}

const styles = StyleSheet.create({
  popView: {
    position: 'absolute',
    flexDirection: 'column',
    left: 0,
    bottom: 0.75 * 1.4 * 0.1 * constUtil.WIDTH + 5,
    backgroundColor: 'transparent',
  },
  pop: {
    backgroundColor: constUtil.USUAL_GREEN,
  },
  changeLayerBtn: {
    alignSelf: 'flex-end',
  },
})