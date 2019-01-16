import { connect } from 'react-redux'
import Personal from './Personal'
import { setUser } from '../../../../models/user'
import { openWorkspace, closeWorkspace } from '../../../../models/map'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
  openWorkspace,
  closeWorkspace,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Personal)
