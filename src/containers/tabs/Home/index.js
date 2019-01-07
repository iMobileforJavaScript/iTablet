import { connect } from 'react-redux'
import Home from './Home'
import { setShow } from '../../../models/device'
import { importSceneWorkspace } from '../../../models/map'

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {
  importSceneWorkspace,
  setShow,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
