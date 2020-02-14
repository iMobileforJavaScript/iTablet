import { connect } from 'react-redux'
import Home from './Home'
import { setShow } from '../../../models/device'
import { setLanguage } from '../../../models/setting'
import {
  importSceneWorkspace,
  openWorkspace,
  closeWorkspace,
} from '../../../models/map'
import { setDownInformation } from '../../../models/down'
import { importWorkspace } from '../../../models/template'
import { setUser } from '../../../models/user'
import { setBackAction, removeBackAction } from '../../../models/backActions'
import { setCurrentMapModule } from '../../../models/appConfig'
import AboutITablet from './AboutITablet'
import Setting from './Setting'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
  appConfig: state.appConfig.toJS(),
  user: state.user.toJS(),
})
const mapDispatchToProps = {
  setLanguage,
  importSceneWorkspace,
  setShow,
  importWorkspace,
  openWorkspace,
  closeWorkspace,
  setUser,
  setDownInformation,
  setBackAction,
  removeBackAction,
  setCurrentMapModule,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)

// const languageStateToProps = state => ({
//   language: state.setting.toJS().language
// })
// const languageDispatchToProps = {
//   setLanguage
// }
// // export default connect(
//   languageStateToProps,
//   languageDispatchToProps,
// )(HomePopupModal)

export { AboutITablet, Setting }
