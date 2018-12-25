import { connect } from 'react-redux'
import Home from './Home'
import { setShow } from '../../../models/device'
import { map3DleadWorkspace } from '../../../models/map'

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {
  setShow,
  map3DleadWorkspace,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
