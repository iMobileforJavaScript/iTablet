import BufferAnalystView from './BufferAnalystView'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
  currentUser: state.user.toJS().currentUser,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BufferAnalystView)
