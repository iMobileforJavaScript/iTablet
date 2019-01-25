import Setting from './setting'
import { connect } from 'react-redux'
import { setSettingData } from '../../models/setting'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  settingData: state.setting.toJS().settingData,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {
  setSettingData,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Setting)
