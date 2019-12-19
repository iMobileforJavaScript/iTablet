import WorkspaceFileList from './WorkspaceFileList'
import { connect } from 'react-redux'
import {
  setEditLayer,
  setSelection,
  setAnalystLayer,
} from '../../models/layers'
import { setBufferSetting, setOverlaySetting } from '../../models/setting'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setSelection,
  setBufferSetting,
  setOverlaySetting,
  setAnalystLayer,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkspaceFileList)
