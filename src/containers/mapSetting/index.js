import MapSetting from './MapSetting'
import { connect } from 'react-redux'
import { setSettingData, setMapLegend } from '../../models/setting'
import { closeMap } from '../../models/map'
import { setBackAction, removeBackAction } from '../../models/backActions'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  currentMap: state.map.toJS().currentMap,
  mapSetting: state.setting.toJS().mapSetting,
  device: state.device.toJS().device,
  mapLegend: state.setting.toJS().mapLegend,
})

const mapDispatchToProps = {
  setSettingData,
  closeMap,
  setMapLegend,
  setBackAction,
  removeBackAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapSetting)
