import Setting from './setting'
import { connect } from 'react-redux'
import { setSettingData } from '../../models/setting'
import { setBackAction, removeBackAction } from '../../models/backActions'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  settingData: state.setting.toJS().settingData,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {
  setSettingData,
  setBackAction,
  removeBackAction,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Setting)
