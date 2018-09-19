import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Toast, scaleSize } from '../../../../utils'
import {
  Action,
  DatasetType,
} from 'imobile_for_javascript'
import { PopBtnSectionList, MTBtnList, MTBtn } from '../../../../components'
import { Const } from '../../../../constains'
import PropTypes from 'prop-types'
import NavigationService from '../../../NavigationService'
import NetworkAnalystToolBar from '../NetworkAnalystToolBar'
import CollectionToolBar from '../CollectionToolBar'
import { bufferAnalyst, overlayAnalyst } from '../../util'
import Setting from '../Setting'
import constants from '../constants'

export default class PopList extends React.Component {

  static propTypes = {
    popType: PropTypes.string,
    mapControl: PropTypes.any,
    mapView: PropTypes.any,
    workspace: PropTypes.any,
    map: PropTypes.any,
    chooseLayer: PropTypes.func,
    showSetting: PropTypes.func,
    showMeasure: PropTypes.func,
    subPopShow: PropTypes.bool,
    editLayer: PropTypes.object,
    selection: PropTypes.object,
    setLoading: PropTypes.func,
    setOverlaySetting: PropTypes.func,
    POP_List: PropTypes.func,
    showRemoveObjectDialog: PropTypes.func,
    setSelection: PropTypes.func,

    bufferSetting: PropTypes.object,
    overlaySetting: PropTypes.object,
  }

  constructor(props) {
    super(props)
    let data = this.getData()
    let { currentOperation, currentIndex, lastIndex } = this.findCurrentData(data, props.editLayer.type)
    this.state = {
      data: data,
      subPopShow: props.editLayer.type !== undefined && props.editLayer.type >= 0,
      toolbar: 'normal',
      currentOperation: currentOperation,
      currentIndex: currentIndex,  // currentOperation index
      lastIndex: lastIndex,     // currentOperation last index
      currentSubKey: '',
      lastSubKey: '',
    }
    this.cbData = {}
    this.operationCallback = () => { } // 当前选择的二级操作的毁掉函数
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.editLayer) !== JSON.stringify(this.props.editLayer)) {
      if (prevProps.editLayer.type !== this.props.editLayer.type) {
        this.cbData.callback && typeof this.cbData.callback === "function" && this.cbData.callback(true)
      }
      let data = this.getData(this.props.popType)
      this.setState({
        data: data,
        subPopShow: true,
      })
    } else if (prevProps.popType !== this.props.popType) {
      let data = this.getData(this.props.popType)
      let { currentOperation, currentIndex, lastIndex } = this.findCurrentData(data, this.props.editLayer.type)
      this.setState({
        data: data,
        currentOperation: currentOperation,
        currentIndex: currentIndex,  // currentOperation index
        lastIndex: lastIndex,     // currentOperation last index
        currentSubKey: currentOperation !== this.state.currentOperation ? '' : this.state.currentSubKey,
        lastSubKey: currentOperation !== this.state.currentOperation ? '' : this.state.currentSubKey,
      })
    }
  }

  selectSubOperation = (key = '') => {
    if (!key || key === this.state.currentSubKey) {
      this.select()
      this.setState({
        currentSubKey: '',
        lastSubKey: key === this.state.currentSubKey ? '' : this.state.currentSubKey,
      })
    } else {
      this.setState({
        currentSubKey: key,
        lastSubKey: this.state.currentSubKey,
      })
    }
  }

  /**
   * 判断是否选择了可编辑图层的对象
   * @returns {Object|boolean|*}
   */
  checkSelection = () => {
    let editable = this.props.selection && this.props.selection.editable
    !editable && Toast.show('请选择一个可编辑对象')
    return editable
  }

  //==============================二级==================================
  /** 选择 **/
  select = async () => {
    await this.props.mapControl.setAction(Action.SELECT)
    // await this.props.mapControl.setAction(Action.VERTEXEDIT)
    await this.props.setSelection()
  }

  /** 添加节点 **/
  addNode = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    if (this.checkSelection() && callback && callback()) {
      await this.props.mapControl.setAction(Action.VERTEXADD)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.ADD_NODE)
  }

  /** 编辑节点 **/
  editNode = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    if (this.checkSelection() && callback && callback()) {
      await this.props.mapControl.setAction(Action.VERTEXEDIT)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.EDIT_NODE)
  }

  /** 删除节点 **/
  deleteNode = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    if (this.checkSelection() && callback && callback()) {
      await this.props.mapControl.setAction(Action.VERTEXDELETE)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.DELETE_NODE)
  }

  /** 撤销 **/
  _undo = async () => {
    if (this.props.mapControl) {
      // this.selectSubOperation()
      // await this.collector.undo()
      await this.props.mapControl.undo()
    }
  }

  /** 重做 **/
  _redo = async () => {
    if (this.props.mapControl) {
      // this.selectSubOperation()
      // await this.collector.redo()
      await this.props.mapControl.redo()
    }
  }

  /** 绘制直线 **/
  createPolyline = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    if (this.checkSelection() && callback && callback()) {
      await this.props.mapControl.setAction(Action.CREATEPOLYLINE)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.CREATE_POLYLINE)
  }

  /** 绘制多边形 **/
  createPolygon = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    if (this.checkSelection() && callback && callback()) {
      await this.props.mapControl.setAction(Action.CREATEPOLYGON)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.CREATE_POLYGON)
  }

  /** 删除 **/
  delete = async () => {
    // this.selectSubOperation()
    // await this.props.mapControl.setAction(Action.CREATEPOLYGON)
    this.props.showRemoveObjectDialog && this.props.showRemoveObjectDialog()
  }

  /** 打断 **/
  break = async ({ callback = () => { } }) => {
    // TODO 打断
    this.operationCallback = callback
    if (this.checkSelection() && callback && callback()) {
      this.toDoAction()
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.BREAK)
    // await this.props.mapControl.setAction(Action.CREATEPOLYGON)
  }

  //============================面操作======================================
  /** 切割面 **/
  splitRegion = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    // if (this.checkSelection() && callback && callback()) {
    if (callback && callback()) {
      await this.props.mapControl.setAction(Action.SPLIT_BY_LINE)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.SPLIT_REGION)
  }

  /** 合并面 **/
  merge = async ({ callback = () => { } }) => {
    // this.selectSubOperation(constants.MERGE)
    this.operationCallback = callback
    // if (this.checkSelection() && callback && callback()) {
    if (callback && callback()) {
      await this.props.mapControl.setAction(Action.UNION_REGION)
    } else {
      await this.select()
    }
  }

  /** 擦除面 **/
  eraseRegion = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    // if (this.checkSelection() && callback && callback()) {
    if (callback && callback()) {
      await this.props.mapControl.setAction(Action.ERASE_REGION)
    } else {
      await this.select()
    }
  }

  /** 手绘擦除面 **/
  drawRegionEraseRegion = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    // if (this.checkSelection() && callback && callback()) {
    if (callback && callback()) {
      await this.props.mapControl.setAction(Action.DRAWREGION_ERASE_REGION)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.DRAW_HOLLOW_REGION)
  }

  /** 生成岛洞 **/
  drawHollowRegion = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    // if (this.checkSelection() && callback && callback()) {
    if (callback && callback()) {
      await this.props.mapControl.setAction(Action.DRAW_HOLLOW_REGION)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.COMPOSE_HOLLOW_REGION)
  }

  /** 手绘岛洞 **/
  drawRegionHollowRegion = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    // if (this.checkSelection() && callback && callback()) {
    if (callback && callback()) {
      await this.props.mapControl.setAction(Action.DRAWREGION_HOLLOW_REGION)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.DRAW_HOLLOW_REGION)
  }

  /** 填充岛洞 **/
  fillHollowRegion = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    // if (this.checkSelection() && callback && callback()) {
    if (callback && callback()) {
      await this.props.mapControl.setAction(Action.FILL_HOLLOW_REGION)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.FILL_HOLLOW_REGION)
  }

  /** 补充岛洞 **/
  patchHollowRegion = async ({ callback = () => { } }) => {
    this.operationCallback = callback
    if (this.checkSelection() && callback && callback()) {
      await this.props.mapControl.setAction(Action.PATCH_HOLLOW_REGION)
    } else {
      await this.select()
    }
    // this.selectSubOperation(constants.PATCH_HOLLOW_REGION)
    // await this.props.mapControl.setAction(Action.PATCH_POSOTIONAL_REGION)
  }

  attribute = ({ callback = () => { } }) => {
    (async function () {
      callback && callback(true)
      // await this.select()
      // this.selectSubOperation()
      // TODO selection 转化为 redux中的 selection
      let selection = await this.props.editLayer.layer.getSelection()
      let count = await selection.getCount()
      if (count > 0) {
        // NavigationService.navigate('LayerAttribute',{ selection: selection })
        // NavigationService.navigate('LayerAttribute',{ recordset: selection.recordset })
        let recordset = await selection.toRecordset()
        NavigationService.navigate('LayerAttribute', { recordset: recordset })
      } else {
        Toast.show('请选择目标')
      }
    }.bind(this)())
    // NavigationService.navigate('LayerAttribute', { selection: '' })
    // Toast.show('正在加紧制作ing...')
  }

  /**  执行  **/
  submit = async ({ callback = () => { } }) => {
    callback && callback(true)
    // this.selectSubOperation()
    await this.props.mapControl.submit()
    await this.select()
  }

  showMeasure = () => {
    this.props.showMeasure && this.props.showMeasure()
  }

  /** 切换图层 **/
  _changeLayer = type => {
    this.props.chooseLayer && this.props.chooseLayer({
      type: -1,
      isEdit: true,
    }, (isShow, dsType) => { // 传 -1 查询所有类型的图层
      if (this.props.POP_List) {
        let datas = this.getData(type)
        let data
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].type === dsType) {
            data = datas[i]
            break
          }
        }
        let current = this.findCurrentData(datas, data.type)
        this.setState({
          ...current,
        })
        this.props.POP_List(true, type)
        this.operationCallback(true)
        this.popList && this.popList.setCurrentOption(data)
      }
    })
  }

  //============================分类操作======================================
  _chooseLayer = async (cbData, type) => {
    this.cbData = cbData
    this.operationCallback(true)
    await this.select()
    this.props.chooseLayer && this.props.chooseLayer({
      type,
      isEdit: true,
    })
    this.popList && this.popList.setCurrentOption(cbData.data)
  }

  _analyst = async cbData => {
    this.cbData = cbData
    this.cbData.callback && this.cbData.callback(true)
    // this.props.chooseLayer && this.props.chooseLayer(DatasetType.LINE)
    this.setState({
      data: this.getData(Const.ANALYST),
      subPopShow: true,
    })
  }

  toDoAction = () => {
    Toast.show('功能待完善')
  }

  //============================缓冲区操作======================================
  /** *缓冲区分析* **/
  _bufferAnalyst = () => {
    if (this.props.selection.layer._SMLayerId !== this.props.bufferSetting.selectedLayer.id) {
      Toast.show('请选择设置的图层进行分析')
      return
    }
    bufferAnalyst.analyst({
      layer: this.props.selection.layer,
      map: this.props.map,
      workspace: this.props.workspace,
      bufferSetting: this.props.bufferSetting,
    })
  }

  /** *叠加分析* **/
  _overlayAnalyst = () => {
    if (!this.props.overlaySetting.datasetVector._SMDatasetVectorId
      || !this.props.overlaySetting.targetDatasetVector._SMDatasetVectorId) {
      Toast.show('请设置分析')
      return
    }
    this.props.setLoading(true)
      ; (async function () {
        try {
          let { result, resultDatasetName, resultLayerName } = await overlayAnalyst.analyst({
            workspace: this.props.workspace,
            method: this.props.overlaySetting.method,
            dataset: this.props.overlaySetting.datasetVector,
            targetDataset: this.props.overlaySetting.targetDatasetVector,
          })
          this.props.setLoading(false)
          if (result) {
            Toast.show('分析成功')
          } else {
            Toast.show('分析失败')
          }

          let datasource = await this.props.workspace.getDatasource(0)
          let dataset = await datasource.getDataset(resultDatasetName)

          await this.props.map.addLayer(dataset, true)

          await this.props.map.refresh()
          this.props.setOverlaySetting && this.props.setOverlaySetting({
            resultDataset: { resultDatasetName, resultLayerName },
          })
          await this.select()
        } catch (e) {
          this.props.setLoading(false)
          Toast.show('分析失败, 请重新设置')
        }
      }).bind(this)()
  }

  /** 打开分析设置 **/
  analystSetting = type => {
    this.props.showSetting && this.props.showSetting(type)
  }

  /** 数据分析操作界面 **/
  openNetworkToolBar = type => {
    (async function () {
      this.setState({
        toolbar: 'network',
        networkType: type,
      })
    }).bind(this)()
  }

  /** 清除缓冲分析 **/
  clearBuffer = () => {
    (async function () {
      let trackLayer = await this.props.map.getTrackingLayer()
      await trackLayer.clear()
      await this.props.map.refresh()
    }).bind(this)()
  }

  /** 清除叠加分析 **/
  clearOverlay = () => {
    (async function () {
      if (this.props.overlaySetting.resultDataset && this.props.overlaySetting.resultDataset) {
        await this.props.map.removeLayer(this.props.overlaySetting.resultDataset.resultLayerName)
        await this.props.map.refresh()
      }
    }).bind(this)()
  }

  getData = type => {
    let data = []
    switch (type || this.props.popType) {
      case Const.DATA_EDIT:
        data = [
          {
            key: '点编辑',
            type: DatasetType.POINT,
            action: cbData => { this._chooseLayer(cbData, DatasetType.POINT) },
            operations: [
              // { key: '选择', action: this.select },
              { key: constants.UNDO, action: this._undo, size: 'large', image: require('../../../../assets/mapTools/icon_undo.png'), selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'), selectMode: 'flash' },
              // { key: constants.REDO, action: this._redo },
              { key: constants.DELETE, action: this.delete, size: 'large', image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
              { key: constants.ATTRIBUTE, action: this.attribute, size: 'large', image: require('../../../../assets/mapTools/icon_attribute.png'), selectedImage: require('../../../../assets/mapTools/icon_attribute_selected.png'), selectMode: 'flash' }],
          },
          {
            key: '线编辑',
            type: DatasetType.LINE,
            action: cbData => { this._chooseLayer(cbData, DatasetType.LINE) },
            operations: [
              // { key: '选择', action: this.select },
              { key: constants.SUBMIT, action: this.submit, size: 'large', image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'), selectMode: 'flash' },
              { key: constants.DELETE, action: this.delete, size: 'large', image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
              { key: constants.UNDO, action: this._undo, size: 'large', image: require('../../../../assets/mapTools/icon_undo.png'), selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'), selectMode: 'flash' },
              { key: constants.REDO, action: this._redo, size: 'large', image: require('../../../../assets/mapTools/icon_redo.png'), selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'), selectMode: 'flash' },
              { key: constants.ADD_NODE, action: this.addNode, size: 'large', image: require('../../../../assets/mapTools/icon_add_node.png'), selectedImage: require('../../../../assets/mapTools/icon_add_node_seleted.png') },
              { key: constants.DELETE_NODE, action: this.deleteNode, size: 'large', image: require('../../../../assets/mapTools/icon_delete_node.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_node_selected.png') },
              { key: constants.EDIT_NODE, action: this.editNode, size: 'large', image: require('../../../../assets/mapTools/icon_edit_node.png'), selectedImage: require('../../../../assets/mapTools/icon_edit_node_selected.png') },
              // { key: constants.BREAK, action: this.break },
              { key: constants.ATTRIBUTE, action: this.attribute, size: 'large', image: require('../../../../assets/mapTools/icon_attribute.png'), selectedImage: require('../../../../assets/mapTools/icon_attribute_selected.png'), selectMode: 'flash' }],
          },
          {
            key: '面编辑',
            type: DatasetType.REGION,
            action: cbData => { this._chooseLayer(cbData, DatasetType.REGION) },
            operations: [
              // { key: '选择', action: this.select },
              { key: constants.SUBMIT, size: 'large', action: this.submit, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'), selectMode: 'flash' },
              { key: constants.DELETE, size: 'large', action: this.delete, image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
              { key: constants.UNDO, size: 'large', action: this._undo, image: require('../../../../assets/mapTools/icon_undo.png'), selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'), selectMode: 'flash' },
              { key: constants.REDO, size: 'large', action: this._redo, image: require('../../../../assets/mapTools/icon_redo.png'), selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'), selectMode: 'flash' },
              { key: constants.ADD_NODE, size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_add_node.png'), selectedImage: require('../../../../assets/mapTools/icon_add_node_seleted.png') },
              { key: constants.DELETE_NODE, size: 'large', action: this.deleteNode, image: require('../../../../assets/mapTools/icon_delete_node.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_node_selected.png') },
              { key: constants.EDIT_NODE, size: 'large', action: this.editNode, image: require('../../../../assets/mapTools/icon_edit_node.png'), selectedImage: require('../../../../assets/mapTools/icon_edit_node_selected.png') },
              { key: constants.SPLIT_REGION, size: 'large', action: this.splitRegion, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.MERGE, size: 'large', action: this.merge, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.ERASE_REGION, size: 'large', action: this.eraseRegion, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.DRAWREGION_ERASE_REGION, size: 'large', action: this.drawRegionEraseRegion, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.DRAW_HOLLOW_REGION, size: 'large', action: this.drawHollowRegion, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.DRAWREGION_HOLLOW_REGION, size: 'large', action: this.drawRegionHollowRegion, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.FILL_HOLLOW_REGION, size: 'large', action: this.fillHollowRegion, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.PATCH_HOLLOW_REGION, size: 'large', action: this.patchHollowRegion, image: require('../../../../assets/mapTools/icon_submit.png'), selectedImage: require('../../../../assets/mapTools/icon_submit_select.png') },
              { key: constants.ATTRIBUTE, size: 'large', action: this.attribute, image: require('../../../../assets/mapTools/icon_attribute.png'), selectedImage: require('../../../../assets/mapTools/icon_attribute_selected.png'), selectMode: 'flash' },
            ],
          },
          // {
          //   key: '文字编辑',
          //   type: DatasetType.TEXT,
          //   action: cbData => {this._chooseLayer(cbData, DatasetType.TEXT)},
          //   operations: [
          //     // { key: '选择', action: this.select },
          //     { key: constants.MODIFIED, action: this.toDoAction },
          //     { key: constants.UNDO, action: this._undo }, { key: constants.REDO, action: this._redo },
          //     { key: constants.DELETE, action: this.toDoAction }, { key: constants.ATTRIBUTE, action: this.toDoAction },
          //   ],
          // },
        ]
        break
      case Const.ANALYST:
        data = [
          {
            key: '缓冲区分析',
            action: cbData => this._analyst(cbData, Const.BUFFER),
            operations: [
              // { key: '设置', action: () => this.analystSetting(Const.BUFFER)}, { key: '分析', action: this._bufferAnalyst },
              // { key: '清除', action: this.clearBuffer },
              { key: '设置', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_setting.png'), selectedImage: require('../../../../assets/mapTools/icon_setting_selected.png') },
              { key: '分析', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_analysis.png'), selectedImage: require('../../../../assets/mapTools/icon_analysis_seleted.png') ,selectMode: 'flash'  },
              { key: constants.DELETE, size: 'large', action: this.delete, image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
            ],
          },
          {
            key: '叠加分析',
            action: cbData => this._analyst(cbData, Const.OVERLAY),
            operations: [
              { key: '设置', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_setting.png'), selectedImage: require('../../../../assets/mapTools/icon_setting_selected.png') },
              { key: '分析', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_analysis.png'), selectedImage: require('../../../../assets/mapTools/icon_analysis_seleted.png') ,selectMode: 'flash'  },
              { key: constants.DELETE, size: 'large', action: this.delete, image: require('../../../../assets/mapTools/icon_delete.png'), selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'), selectMode: 'flash' },
            ],
          },
          {
            key: '网络分析',
            action: cbData => this._analyst(cbData, 'network'),
            operations: [
              { key: '路径分析', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_routanalysis.png'), selectedImage: require('../../../../assets/mapTools/icon_routanalysis_selected.png') },
              { key: '连通性分析', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_connected.png'), selectedImage: require('../../../../assets/mapTools/icon_connected_selectd.png') },
              { key: '商旅分析', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_travel.png'), selectedImage: require('../../../../assets/mapTools/icon_travel_selected.png') },
              { key: '追踪分析', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_track.png'), selectedImage: require('../../../../assets/mapTools/icon_track_selected.png') },
            ],
          },
        ]
        break
      case Const.COLLECTION:
        break
      case Const.TOOLS:
        data = [
          {
            key: '量算',
            action: this.showMeasure,
            operations: [
              { key: '距离量算', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_distance.png'), selectedImage: require('../../../../assets/mapTools/icon_distance_selected.png') },
              { key: '面积量算', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_acreage.png'), selectedImage: require('../../../../assets/mapTools/icon_acreage_selected.png') },             
              { key: '设置', size: 'large', action: this.addNode, image: require('../../../../assets/mapTools/icon_setting.png'), selectedImage: require('../../../../assets/mapTools/icon_setting_selected.png') },
            ]
          }]
        break
    }
    return data
  }

  findCurrentData = (data = [], type) => {
    let current = {
      currentOperation: {},
      currentIndex: -1,  // currentOperation index
      lastIndex: -1,     // currentOperation last index}
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].type && data[i].type === type) {
        current.currentOperation = data[i]
        current.currentIndex = i
        current.lastIndex = i
      }
    }
    return current
  }

  _btn_click_manager = ({ item, index }) => {
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
      }
    })
  }

  render() {
    let currentData = {}
    if (this.props.popType === Const.DATA_EDIT) {
      currentData = this.props.editLayer
    } else if (this.props.popType === Const.COLLECTION) {
      return (
        <CollectionToolBar
          popType={this.state.networkType}
          editLayer={this.props.editLayer}
          selection={this.props.selection}
          mapView={this.props.mapView}
          mapControl={this.props.mapControl}
          workspace={this.props.workspace}
          map={this.props.map}
          analyst={this._analyst}
          showSetting={this.props.showSetting}
          chooseLayer={this.props.chooseLayer}
          POP_List={this.props.POP_List}
          setLoading={this.props.setLoading}
          setSelection={this.props.setSelection}
        />
      )
    }
    if (this.state.toolbar === 'network' && this.props.popType === Const.ANALYST) {
      return (
        <NetworkAnalystToolBar
          popType={this.state.networkType}
          editLayer={this.props.editLayer}
          selection={this.props.selection}
          mapView={this.props.mapView}
          mapControl={this.props.mapControl}
          workspace={this.props.workspace}
          map={this.props.map}
          analyst={this._analyst}
          showSetting={this.props.showSetting}
          chooseLayer={this.props.chooseLayer}
          setLoading={this.props.setLoading}
        />
      )
    } else {
      // return (
      //   <PopBtnSectionList
      //     ref={ref => this.popList = ref}
      //     popType={this.props.popType}
      //     style={styles.pop}
      //     subPopShow={this.state.subPopShow}
      //     data={this.state.data}
      //     currentData={currentData}
      //     operationAction={this._btn_click_manager}
      //     currentOperation={this.state.currentOperation}
      //     currentIndex={this.state.currentIndex}
      //     lastIndex={this.state.lastIndex}
      //   />
      // )
      return (
        <View style={styles.popView}>
          {
            this.props.popType === Const.DATA_EDIT &&
            <MTBtn
              style={styles.changeLayerBtn} imageStyle={styles.changeLayerImage}
              image={require('../../../../assets/map/icon-layer-change.png')} BtnClick={() => this._changeLayer(Const.DATA_EDIT)} />
          }
          <PopBtnSectionList
            ref={ref => this.popList = ref}
            popType={this.props.popType}
            style={styles.pop}
            separatorWidth={30}
            subPopShow={this.state.subPopShow}
            data={this.state.data}
            currentData={currentData}
            operationAction={this._btn_click_manager}
            currentOperation={this.state.currentOperation}
            currentIndex={this.state.currentIndex}
            lastIndex={this.state.lastIndex}
            currentSubKey={this.state.currentSubKey}
            lastSubKey={this.state.lastSubKey}
          />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  pop: {
    // position: 'absolute',
    // left: 0,
    // bottom: 0.75 * 1.4 * 0.1 * constUtil.WIDTH + 5,
    // paddingVertical: scaleSize(30),
    backgroundColor: 'white',
  },
  popView: {
    position: 'absolute',
    flexDirection: 'column',
    left: 0,
    right: 0,
    bottom: scaleSize(100),
    backgroundColor: 'transparent',
  },
  changeLayerBtn: {
    alignSelf: 'flex-end',
    marginRight: scaleSize(10),
    marginBottom: scaleSize(10),
  },
  changeLayerImage: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
})