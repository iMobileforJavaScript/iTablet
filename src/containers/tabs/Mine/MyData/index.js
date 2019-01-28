import MyLocalData from './MyData'
import { importWorkspace } from '../../../../models/template'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
import { uploading } from '../../../../models/online'
const mapStateToProps = state => ({
  user: state.user.toJS(),
  upload: state.online.toJS().upload,
})

const mapDispatchToProps = {
  setUser,
  importWorkspace,
  uploading,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLocalData)
