import MyLocalData from './MyLocalData'
import { importWorkspace } from '../../../../models/template'
import { importSceneWorkspace } from '../../../../models/map'
import { updateDownList } from '../../../../models/online'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  down: state.online.toJS().down,
})

const mapDispatchToProps = {
  setUser,
  importWorkspace,
  importSceneWorkspace,
  updateDownList,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLocalData)
