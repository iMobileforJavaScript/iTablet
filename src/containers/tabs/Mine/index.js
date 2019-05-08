import { connect } from 'react-redux'
import Mine from './Mine'
import { setUser } from '../../../models/user'
import { closeWorkspace, openWorkspace } from '../../../models/map'
import Register from './Register'
import Login from './Login'
import Personal from './Personal'
import ToggleAccount from './ToggleAccount'

import MyService from './MyService'
import MyOnlineMap, { ScanOnlineMap } from './MyService/MyOnlineMap'

import MyLocalData from './MyLocalData'
import MyData from './MyData'
import MyLabel from './MyLabel'
import MyBaseMap from './MyBaseMap'
import MyModule from './MyModule'
// import LoadServer from './MyBaseMap'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  workspace: state.map.toJS().workspace,
})

const mapDispatchToProps = {
  setUser,
  closeWorkspace,
  openWorkspace,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Mine)

export {
  Register,
  MyLocalData,
  MyData,
  MyService,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  Login,
  MyLabel,
  MyBaseMap,
  MyModule,
}
