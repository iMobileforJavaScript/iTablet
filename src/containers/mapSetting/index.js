import MapSetting from './MapSetting'
import { connect } from 'react-redux'
import { setSettingData, setMapLegend } from '../../models/setting'
import { closeMap } from '../../models/map'

const mapStateToProps = state => ({
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapSetting)
