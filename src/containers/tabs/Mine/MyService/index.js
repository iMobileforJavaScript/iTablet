import { connect } from 'react-redux'
import MyService from './MyService'
import { setUser } from '../../../../models/user'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyService)
