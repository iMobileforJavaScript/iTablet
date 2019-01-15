import { connect } from 'react-redux'
import Home from './Home'
import { setShow } from '../../../models/device'
import {
  importSceneWorkspace,
  openWorkspace,
  closeWorkspace,
} from '../../../models/map'
import { importWorkspace } from '../../../models/template'
import { setUser } from '../../../models/user'
import AboutITablet from './AboutITablet'
import Setting from './Setting'
const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {
  importSceneWorkspace,
  setShow,
  importWorkspace,
  openWorkspace,
  closeWorkspace,
  setUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)

export { AboutITablet, Setting }
