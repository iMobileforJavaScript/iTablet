import { connect } from 'react-redux'
import MapView from './MapView'
import { setEditLayer, setSelection, setAnalystLayer } from '../../models/layers'
import { setLatestMap } from '../../models/map'
import { setBufferSetting, setOverlaySetting } from '../../models/setting'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  editLayer: state.layers.toJS().editLayer,
  analystLayer: state.layers.toJS().analystLayer,
  selection: state.layers.toJS().selection,
  latestMap: state.map.toJS().latestMap,
  bufferSetting: state.setting.toJS().buffer,
  overlaySetting: state.setting.toJS().overlay,
})

const mapDispatchToProps = {
	setEditLayer,
  setSelection,
  setLatestMap,
  setBufferSetting,
  setOverlaySetting,
  setAnalystLayer,
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView)
