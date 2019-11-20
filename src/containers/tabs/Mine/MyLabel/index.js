import MyLabel from './MyLabel'
import { importWorkspace } from '../../../../models/template'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
import { uploading } from '../../../../models/online'
import { exportWorkspace } from '../../../../models/map'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  upload: state.online.toJS().upload,
})

const mapDispatchToProps = {
  setUser,
  importWorkspace,
  uploading,
  exportWorkspace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLabel)
