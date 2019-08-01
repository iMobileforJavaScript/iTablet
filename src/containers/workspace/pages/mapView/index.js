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
} from '../../../../models/setting'
import { setSharing } from '../../../../models/online'
import { setCurrentSymbols } from '../../../../models/symbol'
import { setCollectionInfo } from '../../../../models/collection'
import { setBackAction, removeBackAction } from '../../../../models/backActions'
import { setAnalystParams } from '../../../../models/analyst'

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
  mapScaleView: state.setting.toJS().mapScaleView,
  analyst: state.analyst.toJS(),
  downloads: state.down.toJS().downloads,
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
  setCurrentSymbols,
  setMapLegend,
  setBackAction,
  removeBackAction,
  setAnalystParams,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapView)
