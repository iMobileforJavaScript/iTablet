import Chat from './Chat'
import { connect } from 'react-redux'
import { setBackAction, removeBackAction } from '../../../../models/backActions'

const mapDispatchToProps = {
  setBackAction,
  removeBackAction,
}

export default connect(
  null,
  mapDispatchToProps,
)(Chat)
