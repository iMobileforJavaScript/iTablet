import { connect } from 'react-redux'
import { setDevice } from '../../models/setting'
import LocationSetting from './LocationSetting'

const mapStateToProps = state => ({
  peripheralDevice: state.setting.toJS().peripheralDevice,
})
const mapDispatchToProps = {
  setDevice,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSetting)
