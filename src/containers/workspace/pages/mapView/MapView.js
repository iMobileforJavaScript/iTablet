/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  SMMapView,
  Action,
  DatasetType,
  SMap,
  SCollector,
  Utility,
} from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import {
  FunctionToolbar,
  MapToolbar,
  MapController,
  ToolBar,
  MenuAlertDialog,
  SaveView,
  AlertDialog,
} from '../../componets'
import constants from '../../constants'
import {
  Container,
  MTBtn,
  Dialog,
  SaveMapNameDialog,
  SaveDialog,
} from '../../../../components'
import { Toast, scaleSize, jsonUtil } from '../../../../utils'
import { ConstPath, ConstToolType, ConstInfo } from '../../../../constants'
import NavigationService from '../../../NavigationService'
import { Platform, BackHandler } from 'react-native'
import styles from './styles'

export default class MapView extends React.Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    analystLayer: PropTypes.object,
    selection: PropTypes.object,
    latestMap: PropTypes.array,
    navigation: PropTypes.object,

    bufferSetting: PropTypes.object,
    overlaySetting: PropTypes.object,
    symbol: PropTypes.object,

    setEditLayer: PropTypes.func,
    setSelection: PropTypes.func,
    setLatestMap: PropTypes.func,
    setBufferSetting: PropTypes.func,
    setOverlaySetting: PropTypes.func,
    setAnalystLayer: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params.type || 'LOCAL'
    this.mapType = params.mapType || 'DEFAULT'
    this.operationType = params.operationType || constants.COLLECTION
    this.isExample = params.isExample || false
    this.wsData = params.wsData
    this.mapName = params.mapName || ''
    this.path = params.path || ''
    this.showDialogCaption = params.path ? !params.path.endsWith('.smwu') : true
    this.savepath =
      params.type === 'ONLINE' || !params.path
        ? null
        : params.path.substring(0, params.path.lastIndexOf('/') + 1)
    let wsName =
      params.type === 'ONLINE' || !params.path
        ? null
        : params.path.substring(params.path.lastIndexOf('/') + 1)
    wsName =
      params.type === 'ONLINE' || !params.path
        ? null
        : wsName.lastIndexOf('.') > 0 &&
          wsName.substring(0, wsName.lastIndexOf('.'))

    this.state = {
      showMap: false, // 控制地图初始化显示
      data: params.data,
      popShow: false, //  一级popView显示控制
      popType: '',
      mapName: '',
      wsName: wsName,
      measureShow: false,
      measureResult: 0,
      editLayer: {},
      showMapMenu: false,
      changeLayerBtnBottom: scaleSize(200),
    }

    this.closeInfo = [
      {
        btntitle: '是',
        action: () => {
          this.saveMap(NavigationService.goBack(this.props.nav.routes[1].key))
          //this.saveMapAndClose()
          //this.mapType = 'DEFAULT'
          this.AlertDialog.setDialogVisible(false)
        },
      },
      {
        btntitle: '否',
        action: () => {
          this.closeWorkspace(() =>
            NavigationService.goBack(this.props.nav.routes[1].key),
          )
          // SMap.closeMap()
          //this.mapType = 'DEFAULT'
          this.AlertDialog.setDialogVisible(false)
        },
      },
      {
        btntitle: '取消',
        action: () => {
          this.AlertDialog.setDialogVisible(false)
        },
      },
    ]

    this.fullMap = false
  }

  componentDidMount() {
    this.container && this.container.setLoading(true, '地图加载中')
    this.setState({
      showMap: true,
    })
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    this.clearData()
    if (this.toolBox) {
      GLOBAL.toolBox = this.toolBox
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.editLayer) !==
        JSON.stringify(this.props.editLayer) &&
      this.props.nav.routes[this.props.nav.index] === 'MapView'
    ) {
      let name = this.props.editLayer ? this.props.editLayer.name : ''
      name && Toast.show('当前可编辑的图层为\n' + name)
    }
    // 显示切换图层按钮
    if (this.props.editLayer.name && this.popList) {
      let bottom = this.popList.state.subPopShow
        ? scaleSize(400)
        : scaleSize(200)
      bottom !== this.state.changeLayerBtnBottom &&
        this.setState({
          changeLayerBtnBottom: bottom,
        })
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
  }

  clearData = () => {
    this.props.setEditLayer(null)
    this.props.setSelection(null)
    this.props.setBufferSetting(null)
    this.props.setOverlaySetting(null)
    this.props.setAnalystLayer(null)
  }

  closeWorkspace = (cb = () => {}) => {
    if (!this.map || !this.mapControl || !this.workspace) return
    this.saveLatest(
      async function() {
        this.container &&
          this.container.setLoading(true, '正在关闭', { bgColor: 'white' })
        this.clearData()
        this._removeGeometrySelectedListener()
        this.container && this.container.setLoading(false)
        cb && cb()
      }.bind(this),
    )
  }

  saveLatest = (cb = () => {}) => {
    if (this.isExample) {
      cb()
      return
    }
    try {
      this.mapControl &&
        this.mapControl
          .outputMap({ mapView: this.mapView })
          .then(({ result, uri }) => {
            if (result) {
              this.props.setLatestMap(
                {
                  path: (this.DSParams && this.DSParams.server) || this.path,
                  type: this.type,
                  name: this.mapName,
                  image: uri,
                  DSParams: this.DSParams,
                  labelDSParams: this.labelDSParams,
                  layerIndex: this.layerIndex,
                  mapName: this.mapName,
                },
                cb,
              )
            }
          })
    } catch (e) {
      Toast.show('保存失败')
    }
  }

  _onGetInstance = mapView => {
    this.mapView = mapView
    this._addMap()
  }

  /** 设置监听 **/
  /** 选择事件监听 **/
  _addGeometrySelectedListener = async () => {
    await SMap.addGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  _removeGeometrySelectedListener = async () => {
    await SMap.removeGeometrySelectedListener()
  }

  geometrySelected = event => {
    this.props.setSelection && this.props.setSelection(event)
    switch (GLOBAL.currentToolbarType) {
      case ConstToolType.MAP_TOOL_POINT_SELECT:
        break
      case ConstToolType.MAP_EDIT_POINT:
      case ConstToolType.MAP_EDIT_LINE:
      case ConstToolType.MAP_EDIT_REGION:
      case ConstToolType.MAP_EDIT_DEFAULT:
        SMap.appointEditGeometry(event.id, event.layerInfo.name)
        if (GLOBAL.currentToolbarType === ConstToolType.MAP_EDIT_DEFAULT) {
          let column = 4,
            height = ConstToolType.HEIGHT[3],
            tableType = 'normal',
            type = ''
          switch (event.layerInfo.type) {
            case DatasetType.POINT:
              type = ConstToolType.MAP_EDIT_POINT
              height = ConstToolType.HEIGHT[0]
              column = 5
              break
            case DatasetType.LINE:
              type = ConstToolType.MAP_EDIT_LINE
              height = ConstToolType.HEIGHT[2]
              break
            case DatasetType.REGION:
              type = ConstToolType.MAP_EDIT_REGION
              height = ConstToolType.HEIGHT[2]
              break
          }
          this.toolBox &&
            this.toolBox.setVisible(true, type, {
              isFullScreen: false,
              column,
              height,
              tableType,
            })
        }
        break
    }
  }

  geometryMultiSelected = () => {
    // TODO 处理多选
  }

  // 地图保存
  saveMap = (name = '', cb = () => {}) => {
    try {
      this.setLoading(true, '正在保存地图')
      SMap.saveMap(name).then(result => {
        this.setLoading(false)
        Toast.show(
          result ? ConstInfo.CLOSE_MAP_SUCCESS : ConstInfo.CLOSE_MAP_FAILED,
        )
        cb && cb()
      })
    } catch (e) {
      this.setLoading(false)
    }
  }

  // 地图另存为
  saveAsMap = (name = '') => {
    SMap.saveAsMap(name).then(result => {
      Toast.show(
        result ? ConstInfo.CLOSE_MAP_SUCCESS : ConstInfo.CLOSE_MAP_FAILED,
      )
    })
  }

  // 地图保存为xml(fileName, cb)
  saveMapToXML = mapName => {
    this.container.setLoading(true, '正在保存')
    ;(async function() {
      try {
        const filePath =
          (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
          '.xml'
        let config = await jsonUtil.readConfig()
        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.container.setLoading(false)
          } else {
            Toast.show('保存成功')
            this.container.setLoading(false)
            //获取数据源
            //修改数据
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              for (let i = 0; i < config.data[0].maps.length; i++) {
                if (config.data[0].maps[i].mapName === mapName + '.xml') {
                  config.data[0].maps[i].UDBName = data
                  break
                }
              }
              (async function() {
                await jsonUtil.updateMapInfo(config)
              }.bind(this)())
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.saveXMLDialog.setDialogVisible(false)
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  // 地图保存为xml(fileName, cb)
  saveMapToXMLWithDialog = ({ mapName }) => {
    // this.container.setLoading(true, '正在保存')
    (async function() {
      try {
        const filePath =
          (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
          '.xml'
        let config = await jsonUtil.readConfig()
        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.saveXMLDialog.setDialogVisible(false)
            // this.container.setLoading(false)
          } else {
            Toast.show('保存成功')
            this.saveXMLDialog.setDialogVisible(false)
            // this.container.setLoading(false)
            this.mapType = 'LOAD'
            //获取数据源
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              jsonUtil.saveMapInfo(config, mapName, data)
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.saveXMLDialog.setDialogVisible(false)
        // this.container.setLoading(false)
      }
    }.bind(this)())
  }

  // 地图保存
  saveMapWithNoWorkspace = async () => {
    SMap.isModified().then(result => {
      if (result) {
        //有修改
        if (this.mapType === 'DEFAULT' || this.mapType === 'CREATE') {
          //默认地图和创建地图
          //输入地图名字，弹出保存框
          this.saveXMLDialog.setDialogVisible(true)
        } else {
          try {
            (async function() {
              let mapName = await SMap.getMapName()
              await this.saveMapToXML(mapName)
            }.bind(this)())
          } catch (e) {
            Toast.show('保存失败')
          }
        }
      }
    })
  }

  // 地图保存为xml 同时 关闭地图
  saveMapToXMLAndClose = () => {
    // this.container.setLoading(true, '正在保存')
    (async function() {
      try {
        let mapName = await SMap.getMapName()
        const filePath =
          (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
          '.xml'
        let config = await jsonUtil.readConfig()

        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.saveMapDialog.setDialogVisible(false)
            this.container.setLoading(false)
          } else {
            Toast.show('保存成功')
            this.container.setLoading(false)
            this.saveMapDialog.setDialogVisible(false)
            //获取数据源
            //修改数据
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              jsonUtil.saveMapInfo(config, mapName, data)
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.saveMapDialog.setDialogVisible(false)
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  // 地图保存 同时 关闭地图
  saveMapAndClose = () => {
    this.container.setLoading(true, '正在保存')
    ;(async function() {
      try {
        let mapName = await SMap.getMapName()
        const filePath =
          (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
          '.xml'
        let config = await jsonUtil.readConfig()

        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.AlertDialog.setDialogVisible(false)
            this.container.setLoading(false)
          } else {
            Toast.show('保存成功')
            this.container.setLoading(false)
            this.AlertDialog.setDialogVisible(false)
            //获取数据源
            //修改数据
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              for (let i = 0; i < config.data[0].maps.length; i++) {
                if (config.data[0].maps[i].mapName === mapName + '.xml') {
                  config.data[0].maps[i].UDBName = data
                  break
                }
              }
              SMap.closeMap()
              ;(async function() {
                await jsonUtil.updateMapInfo(config)
              }.bind(this)())
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.AlertDialog.setDialogVisible(false)
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  // 删除图层
  removeObject = () => {
    (async function() {
      try {
        if (!this.props.selection || !this.props.selection.id) return
        let result = await SCollector.remove(
          this.props.selection.id,
          this.props.selection.layerInfo.path,
        )
        if (result) {
          Toast.show('删除成功')
          this.props.setSelection && this.props.setSelection()
          SMap.setAction(Action.SELECT)
          // 删除对象后，编辑设为为选择状态
          this.toolBox.setVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
            isFullScreen: false,
            height: 0,
          })
        } else {
          Toast.show('删除失败')
        }
        GLOBAL.removeObjectDialog &&
          GLOBAL.removeObjectDialog.setDialogVisible(false)
      } catch (e) {
        Toast.show('删除失败')
      }
    }.bind(this)())
  }

  renderHeaderBtns = () => {
    if (this.isExample) return null
    let arr = []
    let headerBtnData = [
      {
        key: 'search',
        image: require('../../../../assets/header/icon_search.png'),
        action: () => {
          this.toolBox.setVisible(true, 'list')
        },
      },
      {
        key: 'audio',
        image: require('../../../../assets/header/icon_audio.png'),
        action: () => {
          this.toolBox.setVisible(true, 'table')
        },
      },
    ]
    headerBtnData.forEach(({ key, image, action }) => {
      arr.push(
        <MTBtn
          style={styles.headerBtnSeparator}
          key={key}
          textColor={'white'}
          size={MTBtn.Size.SMALL}
          image={image}
          onPress={action}
        />,
      )
    })
    return arr
  }

  back = () => {
    // this.mapToolbar.setCurrent(0)
    // this.setLoading(true, '正在关闭')
    // SMap.closeWorkspace().then(result => {
    //   this.setLoading(false)
    //   result && NavigationService.goBack()
    // })
    this.backAction = async () => {
      try {
        this.setLoading(true, '正在关闭地图')
        await SMap.closeMap()
        await SMap.closeDatasource()
        this.setLoading(false)
        NavigationService.goBack()
      } catch (e) {
        this.setLoading(false)
      }
    }
    SMap.workspaceIsModified().then(result => {
      if (result) {
        this.setSaveViewVisible(true)
      } else {
        this.backAction()
        this.backAction = null
      }
    })
    return true
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  _addMap = () => {
    (async function() {
      try {
        if (this.wsData === null) return

        if (this.wsData instanceof Array) {
          for (let i = 0; i < this.wsData.length; i++) {
            let item = this.wsData[i]
            if (item === null) continue
            if (item.type === 'Workspace') {
              await this._openWorkspace(
                this.wsData[i],
                this.wsData[i].layerIndex,
              )
            } else {
              await this._openDatasource(
                this.wsData[i],
                this.wsData[i].layerIndex,
              )
            }
          }
        } else {
          if (this.wsData.type === 'Workspace') {
            await this._openWorkspace(this.wsData, this.wsData.layerIndex)
          } else {
            await this._openDatasource(this.wsData, this.wsData.layerIndex)
          }
        }
        this._addGeometrySelectedListener()
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  _openWorkspace = async (wsData, index = -1) => {
    if (!wsData.DSParams || !wsData.DSParams.server) {
      this.container.setLoading(false)
      Toast.show('没有找到地图')
      return
    }
    try {
      let result = await SMap.openWorkspace(wsData.DSParams)
      result && SMap.openMap(index)
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  _openDatasource = async (wsData, index = -1) => {
    if (!wsData.DSParams || !wsData.DSParams.server) {
      this.container.setLoading(false)
      Toast.show('没有找到地图')
      return
    }
    try {
      await SMap.openDatasource(wsData.DSParams, index)
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  /**
   * 下方的保存地图提示组建
   * @param visible
   */
  setSaveViewVisible = visible => {
    this.SaveMapView && this.SaveMapView.setVisible(visible)
  }

  /**
   * 中间弹出的保存地图组建
   * @param visible
   */
  setSaveMapDialogVisible = visible => {
    this.SaveDialog && this.SaveDialog.setDialogVisible(visible)
  }

  /**
   * 底部工具栏
   * @returns {XML}
   */
  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={0}
        type={this.operationType}
      />
    )
  }

  /** 地图功能工具栏（右侧） **/
  renderFunctionToolbar = () => {
    return (
      <FunctionToolbar
        ref={ref => (this.functionToolbar = ref)}
        style={styles.functionToolbar}
        type={this.operationType}
        getToolRef={() => this.toolBox}
        getMenuAlertDialogRef={() => this.MenuAlertDialog}
        showFullMap={this.showFullMap}
        symbol={this.props.symbol}
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        setMapType={this.setMapType}
        save={() => {
          //this.saveMapWithNoWorkspace()
        }}
        saveAs={() => {
          //弹出保存框
          //this.saveXMLDialog.setDialogVisible(true)
        }}
        closeOneMap={() => {
          //弹出关闭选项
          //SMap.isModified().then(result =>{
          //  if(result){
          //    if(this.mapType === 'LOAD')
          //      this.AlertDialog.setDialogVisible(true)
          //    else
          //      this.saveMapDialog.setDialogVisible(true)
          //  }
          //})
        }}
      />
    )
  }

  /** 地图控制器，放大缩小等功能 **/
  renderMapController = () => {
    return <MapController ref={ref => (this.mapController = ref)} />
  }

  /** 显示全屏 **/
  showFullMap = isFull => {
    if (isFull === this.fullMap) return
    let full = isFull === undefined ? !this.fullMap : !isFull
    this.container && this.container.setHeaderVisible(full)
    this.container && this.container.setBottomVisible(full)
    this.functionToolbar && this.functionToolbar.setVisible(full)
    this.mapController && this.mapController.setVisible(full)
    this.fullMap = isFull
  }

  renderMenuDialog = () => {
    return (
      <MenuAlertDialog
        ref={ref => (this.MenuAlertDialog = ref)}
        backHide="true"
        existFullMap={() => this.showFullMap(false)}
        showFullMap={this.showFullMap}
        getToolBarRef={() => this.toolBox}
      />
    )
  }

  /** 改变地图存储类型 是否有本地XML文件 **/
  setMapType = mapType => {
    this.mapType = mapType
  }

  renderTool = () => {
    return (
      <ToolBar
        ref={ref => (this.toolBox = ref)}
        existFullMap={() => this.showFullMap(false)}
        user={this.props.user}
        symbol={this.props.symbol}
        getMenuAlertDialogRef={() => this.MenuAlertDialog}
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        showFullMap={this.showFullMap}
        setSaveViewVisible={this.setSaveViewVisible}
        setSaveMapDialogVisible={this.setSaveMapDialogVisible}
        setContainerLoading={this.setLoading}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.mapName,
          navigation: this.props.navigation,
          headerRight: this.renderHeaderBtns(),
          backAction: this.back,
          type: 'fix',
        }}
        bottomBar={!this.isExample && this.renderToolBar()}
        bottomProps={{ type: 'fix' }}
      >
        {this.state.showMap && (
          <SMMapView
            ref={ref => (GLOBAL.mapView = ref)}
            style={styles.map}
            onGetInstance={this._onGetInstance}
          />
        )}
        {this.renderMapController()}
        {!this.isExample && this.renderFunctionToolbar()}
        {!this.isExample && this.renderTool()}
        {!this.isExample && this.renderMenuDialog()}
        <Dialog
          ref={ref => (GLOBAL.removeObjectDialog = ref)}
          type={Dialog.Type.MODAL}
          title={'提示'}
          info={'是否要删除该对象吗？'}
          confirmAction={this.removeObject}
          confirmBtnTitle={'是'}
          cancelBtnTitle={'否'}
        />
        <SaveMapNameDialog
          ref={ref => (this.saveXMLDialog = ref)}
          confirmAction={this.saveMapToXMLWithDialog}
          showWsName={this.showDialogCaption}
          mapName={this.state.mapName}
        />
        <SaveMapNameDialog
          ref={ref => (this.saveMapDialog = ref)}
          confirmAction={this.saveMapToXMLAndClose}
          showWsName={this.showDialogCaption}
          mapName={this.state.mapName}
        />
        <AlertDialog
          ref={ref => (this.AlertDialog = ref)}
          childrens={this.closeInfo}
          Alerttitle={'是否保存当前地图'}
        />
        <SaveView
          ref={ref => (this.SaveMapView = ref)}
          save={() => {
            this.saveMap('', () => {
              if (this.backAction) {
                this.backAction()
                this.backAction = null
              }
            })
          }}
          notSave={() => {
            if (this.backAction) {
              this.backAction()
              this.backAction = null
            }
          }}
        />
        <SaveDialog
          ref={ref => (this.SaveDialog = ref)}
          confirmAction={data => this.saveAsMap(data.mapName)}
          type="normal"
        />
      </Container>
    )
  }
}
