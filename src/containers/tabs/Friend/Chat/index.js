import Chat from './Chat'
import { connect } from 'react-redux'
import { setBackAction, removeBackAction } from '../../../../models/backActions'
import { closeWorkspace } from '../../../../models/map'

const mapDispatchToProps = {
  setBackAction,
  removeBackAction,
  closeWorkspace,
}

export default connect(
  null,
  mapDispatchToProps,
)(Chat)
