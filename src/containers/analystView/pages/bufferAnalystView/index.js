import BufferAnalystView from './BufferAnalystView'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BufferAnalystView)
