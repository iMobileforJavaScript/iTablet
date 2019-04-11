import { connect } from 'react-redux'
import Home from './Home'
import { setShow } from '../../../models/device'
import {
  importSceneWorkspace,
  openWorkspace,
  closeWorkspace,
} from '../../../models/map'
import { setDownInformation } from '../../../models/down'
import { importWorkspace } from '../../../models/template'
import { setUser } from '../../../models/user'
import AboutITablet from './AboutITablet'
import Setting from './Setting'
const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
  downList: state.down.toJS().downList,
  user: state.user.toJS(),
})
const mapDispatchToProps = {
  importSceneWorkspace,
  setShow,
  importWorkspace,
  openWorkspace,
  closeWorkspace,
  setUser,
  setDownInformation,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)

export { AboutITablet, Setting }
