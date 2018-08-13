import * as React from 'react'
import { StyleSheet } from 'react-native'
import { constUtil, Toast } from '../../../../utils'
import {
  Action,
  DatasetType,
} from 'imobile_for_javascript'
import { PopBtnSectionList, MTBtnList } from '../../../../components'
import PropTypes from 'prop-types'
import NavigationService from '../../../NavigationService'
import NetworkAnalystToolBar from '../NetworkAnalystToolBar'
import CollectionToolBar from '../CollectionToolBar'
import { bufferAnalyst, overlayAnalyst } from '../../util'
import Setting from '../Setting'

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
    }
    this.cbData = {}
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
      })
    }
  }

  // ===========================一级==================================


  //==============================二级==================================
  /** 选择 **/
  select = async () => {
    await this.props.mapControl.setAction(Action.SELECT)
  }

  /** 添加节点 **/
  addNode = async () => {
    await this.props.mapControl.setAction(Action.VERTEXADD)
  }

  /** 编辑节点 **/
  editNode = async () => {
    await this.props.mapControl.setAction(Action.VERTEXEDIT)
  }

  /** 删除节点 **/
  deleteNode = async () => {
    await this.props.mapControl.setAction(Action.DELETENODE)
  }

  /** 撤销 **/
  _undo = async () => {
    if(this.props.mapControl) {
      // await this.collector.undo()
      await this.props.mapControl.undo()
    }
  }

  /** 重做 **/
  _redo = async () => {
    if(this.props.mapControl) {
      // await this.collector.redo()
      await this.props.mapControl.redo()
    }
  }

  /** 绘制直线 **/
  createPolyline = async () => {
    await this.props.mapControl.setAction(Action.CREATEPOLYLINE)
  }

  /** 绘制多边形 **/
  createPolygon = async () => {
    await this.props.mapControl.setAction(Action.CREATEPOLYGON)
  }

  /** 删除 **/
  delete = async () => {
    // TODO 删除
    // await this.props.mapControl.setAction(Action.CREATEPOLYGON)
    this.props.showRemoveObjectDialog && this.props.showRemoveObjectDialog()
  }

  /** 打断 **/
  break = async () => {
    // TODO 打断
    // await this.props.mapControl.setAction(Action.CREATEPOLYGON)
    this.toDoAction()
  }

  //============================面操作======================================
  /** 切割面 **/
  splitRegion = async () => {
    await this.props.mapControl.setAction(Action.SPLIT_BY_LINE)
  }

  /** 合并面 **/
  merge = async () => {
    await this.props.mapControl.setAction(Action.UNION_REGION)
  }

  /** 岛洞 **/
  drawHollowRegion = async () => {
    await this.props.mapControl.setAction(Action.DRAWREGION_HOLLOW_REGION)
  }

  /** 填充岛洞 **/
  fillHollowRegion = async () => {
    await this.props.mapControl.setAction(Action.FILL_HOLLOW_REGION)
  }

  /** 补充岛洞 **/
  patchHollowRegion = async () => {
    await this.props.mapControl.setAction(Action.PATCH_POSOTIONAL_REGION)
  }

  attribute = () => {
    (async function() {
      // TODO selection 转化为 redux中的 selection
      let selection = await this.props.editLayer.layer.getSelection()
      let count  = await selection.getCount()
      if (count > 0) {
        // NavigationService.navigate('LayerAttribute',{ selection: selection })
        NavigationService.navigate('LayerAttribute',{ recordset: selection.recordset })
      } else {
        Toast.show('请选择目标')
      }
    }.bind(this)())
    // NavigationService.navigate('LayerAttribute', { selection: '' })
    // Toast.show('正在加紧制作ing...')
  }

  /**  执行  **/
  submit = async () => {
    await this.props.mapControl.submit()
    await this.select()
  }

  showMeasure = () => {
    this.props.showMeasure && this.props.showMeasure()
  }

  //============================分类操作======================================
  _chooseLayer = async (cbData, type) => {
    this.cbData = cbData
    this.props.chooseLayer && this.props.chooseLayer(type, true)
    this.popList && this.popList.setCurrentOption(cbData.data)
  }

  _analyst = async (cbData, type) => {
    this.cbData = cbData
    this.cbData.callback && this.cbData.callback(true)
    // this.props.chooseLayer && this.props.chooseLayer(DatasetType.LINE)
    this.setState({
      data: this.getData(MTBtnList.Operation.ANALYST),
      subPopShow: true,
    })
  }

  toDoAction = () => {
    Toast.show('功能待完善')
  }

  //============================缓冲区操作======================================
  /** *缓冲区分析* **/
  _bufferAnalyst = () => {
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
    ;(async function () {
      try {

        let { result, resultDatasetName, resultLayerName } = await overlayAnalyst.analyst({
          workspace: this.props.workspace,
          method: this.props.overlaySetting.method,
          dataset: this.props.overlaySetting.datasetVector.dataset,
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
          resultDataset: {resultDatasetName, resultLayerName},
        })
        await this.select()
      } catch (e) {
        console.log(e)


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
      if(this.props.overlaySetting.resultDataset && this.props.overlaySetting.resultDataset) {
        await this.props.map.removeLayer(this.props.overlaySetting.resultDataset.resultLayerName)
        await this.props.map.refresh()
      }
    }).bind(this)()
  }

  getData = type => {
    let data = []
    switch (type || this.props.popType) {
      case MTBtnList.Operation.DATA_EDIT:
        data = [
          {
            key: '点编辑',
            type: DatasetType.POINT,
            action: cbData => {this._chooseLayer(cbData, DatasetType.POINT)},
            operations: [
              // { key: '选择', action: this.select },
              { key: '撤销', action: this._undo },
              { key: '重做', action: this._redo },
              { key: '删除', action: this.deleteNode },
              { key: '属性', action: this.attribute }],
          },
          {
            key: '线编辑',
            type: DatasetType.LINE,
            action: cbData => {this._chooseLayer(cbData, DatasetType.LINE)},
            operations: [
              // { key: '选择', action: this.select },
              { key: '执行', action: this.submit }, { key: '删除', action: this.delete },
              { key: '撤销', action: this._undo }, { key: '重做', action: this._redo },
              { key: '添加节点', action: this.addNode }, { key: '删除节点', action: this.deleteNode },
              { key: '编辑节点', action: this.editNode }, { key: '打断', action: this.break },
              { key: '属性', action: this.attribute }],
          },
          {
            key: '面编辑',
            type: DatasetType.REGION,
            action: cbData => {this._chooseLayer(cbData, DatasetType.REGION)},
            operations: [
              // { key: '选择', action: this.select },
              { key: '执行', action: this.submit }, { key: '删除', action: this.delete },
              { key: '撤销', action: this._undo }, { key: '重做', action: this._redo },
              { key: '添加节点', action: this.addNode }, { key: '删除节点', action: this.deleteNode },
              { key: '编辑节点', action: this.editNode }, { key: '切割', action: this.splitRegion },
              { key: '合并', action: this.merge }, { key: '岛洞', action: this.drawHollowRegion },
              { key: '填充岛洞', action: this.fillHollowRegion }, { key: '补充岛洞', action: this.patchHollowRegion },
              { key: '属性', action: this.attribute },
            ],
          },
          {
            key: '文字编辑',
            type: DatasetType.TEXT,
            action: cbData => {this._chooseLayer(cbData, DatasetType.TEXT)},
            operations: [
              // { key: '选择', action: this.select },
              { key: '修改', action: this.toDoAction },
              { key: '撤销', action: this._undo }, { key: '重做', action: this._redo },
              { key: '删除', action: this.toDoAction }, { key: '属性', action: this.toDoAction },
            ],
          },
        ]
        break
      case MTBtnList.Operation.ANALYST:
        data = [
          {
            key: '缓冲区分析',
            action: cbData => this._analyst(cbData, Setting.Type.BUFFER),
            operations: [
              { key: '设置', action: () => this.analystSetting(Setting.Type.BUFFER)}, { key: '分析', action: this._bufferAnalyst },
              { key: '清除', action: this.clearBuffer },
            ],
          },
          {
            key: '叠加分析',
            action: cbData => this._analyst(cbData, Setting.Type.OVERLAY),
            operations: [
              { key: '设置', action: () => this.analystSetting(Setting.Type.OVERLAY)}, { key: '分析', action: this._overlayAnalyst },
              { key: '清除', action: this.clearOverlay },
            ],
          },
          {
            key: '网络分析',
            action: cbData => this._analyst(cbData, 'network'),
            operations: [
              { key: '路径分析', action: () => this.openNetworkToolBar(NetworkAnalystToolBar.Type.ROUTE)},
              { key: '连通性分析', action: () => this.openNetworkToolBar(NetworkAnalystToolBar.Type.FACILITY)},
              { key: '商旅分析', action: () => this.openNetworkToolBar(NetworkAnalystToolBar.Type.TSP)},
              { key: '追踪分析', action: () => this.openNetworkToolBar(NetworkAnalystToolBar.Type.TRACKING)},
            ],
          },
        ]
        break
      case MTBtnList.Operation.COLLECTION:
        break
      case MTBtnList.Operation.TOOLS:
        data = [{ key: '量算', action: this.showMeasure }]
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
      if (data[i].type === type) {
        current.currentOperation = data[i]
        current.currentIndex = i
        current.lastIndex = i
      }
    }
    return current
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

  render() {
    let currentData = {}
    if (this.props.popType === MTBtnList.Operation.DATA_EDIT) {
      currentData = this.props.editLayer
    } else if (this.props.popType === MTBtnList.Operation.COLLECTION) {
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
    if (this.state.toolbar === 'network') {
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
      return (
        <PopBtnSectionList
          ref={ref => this.popList = ref}
          popType={this.props.popType}
          style={styles.pop}
          subPopShow={this.state.subPopShow}
          data={this.state.data}
          currentData={currentData}
          operationAction={this._btn_click_manager}
          currentOperation={this.state.currentOperation}
          currentIndex={this.state.currentIndex}
          lastIndex={this.state.lastIndex}
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  pop: {
    position: 'absolute',
    left: 0,
    bottom: 0.75 * 1.4 * 0.1 * constUtil.WIDTH + 5,
    backgroundColor: constUtil.USUAL_GREEN,
  },
})