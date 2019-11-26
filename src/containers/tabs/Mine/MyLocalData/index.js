import MyLocalData from './MyLocalData'
import { importPlotLib, importWorkspace } from '../../../../models/template'
import { importSceneWorkspace } from '../../../../models/map'
import { updateDownList, removeItemOfDownList } from '../../../../models/online'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
import { setImportItem } from '../../../../models/externalData'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  down: state.online.toJS().down,
  importItem: state.externalData.toJS().importItem,
})

const mapDispatchToProps = {
  setUser,
  importPlotLib,
  importWorkspace,
  importSceneWorkspace,
  updateDownList,
  removeItemOfDownList,
  setImportItem,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLocalData)
