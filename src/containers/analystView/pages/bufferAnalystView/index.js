import BufferAnalystView from './BufferAnalystView'
import { connect } from 'react-redux'
import { getLayers } from '../../../../models/layers'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BufferAnalystView)
