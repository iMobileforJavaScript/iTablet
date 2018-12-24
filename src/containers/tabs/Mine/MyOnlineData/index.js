import MyOnlineData from './MyOnlineData'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
import { openWorkspace } from '../../../../models/map'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
  openWorkspace,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyOnlineData)
