import MyLocalData from './MyLocalData'
import { importWorkspace } from '../../../../models/template'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
  importWorkspace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLocalData)
