import { connect } from 'react-redux'
import Personal from './Personal'
import { setUser } from '../../models/user'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Personal)
