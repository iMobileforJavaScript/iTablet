import { connect } from 'react-redux'
import ToggleAccount from './ToggleAccount'
import { setUser, deleteUser } from '../../../../models/user'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
  deleteUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleAccount)
