import Find from './Find'
import { connect } from 'react-redux'
import { setUser } from '../../../models/user'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Find)
