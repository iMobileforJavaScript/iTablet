import { connect } from 'react-redux'
import Mine from './Mine'
import { setUser } from '../../../models/user'
import { closeWorkspace, openWorkspace } from '../../../models/map'
import Register from './Register'
import { SelectLogin, Login, IPortalLogin } from './Login'
import Personal from './Personal'
import ToggleAccount from './ToggleAccount'

import MyService from './MyService'
import MyOnlineMap, { ScanOnlineMap } from './MyService/MyOnlineMap'

import MyLocalData from './MyLocalData'
import MyMap from './MyMap'
import MyScene from './MyScene'
import MyDatasource from './MyDatasource'
import MySymbol from './MySymbol'
import MyTemplate from './MyTemplate'
import MyColor from './MyColor'
import MyLabel from './MyLabel'
import MyBaseMap from './MyBaseMap'
import MyDataset from './MyDatasource/MyDataset'
import NewDataset from './MyDatasource/NewDataset'
import SearchMine from './Search'
// import LoadServer from './MyBaseMap'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  workspace: state.map.toJS().workspace,
  device: state.device.toJS().device,
  mineModules: state.appConfig.toJS().mineModules,
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
  MyMap,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  MyService,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  SelectLogin,
  Login,
  IPortalLogin,
  MyLabel,
  MyBaseMap,
  MyDataset,
  NewDataset,
  SearchMine,
}
