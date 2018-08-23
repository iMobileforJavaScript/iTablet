import WorkspaceFlieList from './WorkspaceFlieList'
import { connect } from 'react-redux'
import { setEditLayer, setSelection, setAnalystLayer } from '../../models/layers'
import { setBufferSetting, setOverlaySetting } from '../../models/setting'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setSelection,
  setBufferSetting,
  setOverlaySetting,
  setAnalystLayer,
}
export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceFlieList)