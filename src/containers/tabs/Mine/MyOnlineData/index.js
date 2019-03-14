import MyOnlineData from './MyOnlineData'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
import { importWorkspace } from '../../../../models/template'
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
)(MyOnlineData)
