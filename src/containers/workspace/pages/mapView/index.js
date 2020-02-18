import { connect } from 'react-redux'
import MapView from './MapView'
import {
  setEditLayer,
  setSelection,
  setAnalystLayer,
  getLayers,
  setCurrentAttribute,
  setCurrentLayer,
  clearAttributeHistory,
} from '../../../../models/layers'
import {
  setLatestMap,
  setCurrentMap,
  getMaps,
  openWorkspace,
  closeWorkspace,
  exportWorkspace,
  openMap,
  closeMap,
  saveMap,
} from '../../../../models/map'
import {
  importTemplate,
  importWorkspace,
  setCurrentTemplateInfo,
  setCurrentPlotInfo,
  setTemplate,
  getSymbolTemplates,
  getSymbolPlots,
} from '../../../../models/template'
import {
  setBufferSetting,
  setOverlaySetting,
  getMapSetting,
  setMapLegend,
  setMapNavigation,
  setMap2Dto3D,
  setMapIs3D,
  setNavigationChangeAR,
  setNavigationPoiView,
  setOpenOnlineMap,
  setNavigationHistory,
} from '../../../../models/setting'
import { setMapSearchHistory } from '../../../../models/histories'
import { setSharing } from '../../../../models/online'
import { setCurrentSymbols, setCurrentSymbol } from '../../../../models/symbol'
import { setCollectionInfo } from '../../../../models/collection'
import { setBackAction, removeBackAction } from '../../../../models/backActions'
import { setAnalystParams } from '../../../../models/analyst'
import { downloadFile, deleteDownloadFile } from '../../../../models/down'
import { setToolbarStatus } from '../../../../models/toolbarStatus'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  editLayer: state.layers.toJS().editLayer,
  analystLayer: state.layers.toJS().analystLayer,
  selection: state.layers.toJS().selection,
  latestMap: state.map.toJS().latestMap,
  map: state.map.toJS(),
  bufferSetting: state.setting.toJS().buffer,
  overlaySetting: state.setting.toJS().overlay,
  symbol: state.symbol.toJS(),
  user: state.user.toJS(),
  currentLayer: state.layers.toJS().currentLayer,
  layers: state.layers.toJS(),
  collection: state.collection.toJS(),
  template: state.template.toJS(),
  device: state.device.toJS().device,
  online: state.online.toJS(),
  mapLegend: state.setting.toJS().mapLegend,
  mapNavigation: state.setting.toJS().mapNavigation,
  map2Dto3D: state.setting.toJS().map2Dto3D,
  mapIs3D: state.setting.toJS().mapIs3D,
  navigationChangeAR: state.setting.toJS().navigationChangeAR,
  navigationPoiView: state.setting.toJS().navigationPoiView,
  mapScaleView: state.setting.toJS().mapScaleView,
  analyst: state.analyst.toJS(),
  downloads: state.down.toJS().downloads,
  mapSearchHistory: state.histories.toJS().mapSearchHistory,
  openOnlineMap: state.setting.toJS().openOnlineMap,
  navigationhistory: state.setting.toJS().navigationhistory,
  toolbarStatus: state.toolbarStatus.toJS(),
  appConfig: state.appConfig.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setSelection,
  setLatestMap,
  setBufferSetting,
  setOverlaySetting,
  setAnalystLayer,
  setCurrentMap,
  getLayers,
  setCollectionInfo,
  setCurrentLayer,
  setCurrentAttribute,
  clearAttributeHistory,
  importTemplate,
  importWorkspace,
  setCurrentTemplateInfo,
  setCurrentPlotInfo,
  setTemplate,
  getMaps,
  exportWorkspace,
  openWorkspace,
  closeWorkspace,
  openMap,
  closeMap,
  getSymbolTemplates,
  getSymbolPlots,
  saveMap,
  getMapSetting,
  setSharing,
  setCurrentSymbol,
  setCurrentSymbols,
  setMapLegend,
  setBackAction,
  removeBackAction,
  setAnalystParams,
  setMapNavigation,
  setMap2Dto3D,
  setMapIs3D,
  setNavigationChangeAR,
  setNavigationPoiView,
  setMapSearchHistory,
  setNavigationHistory,
  setOpenOnlineMap,
  downloadFile,
  deleteDownloadFile,
  setToolbarStatus,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView)
