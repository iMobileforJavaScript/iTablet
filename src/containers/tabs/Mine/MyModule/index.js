import MyModule from './MyModule'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyModule)
