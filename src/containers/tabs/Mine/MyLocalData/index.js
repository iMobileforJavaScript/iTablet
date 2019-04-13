import MyLocalData from './MyLocalData'
import { importWorkspace } from '../../../../models/template'
import { importSceneWorkspace } from '../../../../models/map'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
const mapStateToProps = state => ({
  language:state.setting.toJS().language,
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
  importWorkspace,
  importSceneWorkspace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLocalData)
