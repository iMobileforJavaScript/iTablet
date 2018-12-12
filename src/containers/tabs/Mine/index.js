import { connect } from 'react-redux'
import Mine from './Mine'
import { setUser } from '../../../models/user'
import Register from './Register'
import MyService from './MyService'
import MyLocalData from './MyLocalData'
import MyOnlineData from './MyOnlineData'
import Login from './Login'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Mine)

export {
  Register,
  MyOnlineData,
  MyLocalData,
  MyService,
  Login,
}