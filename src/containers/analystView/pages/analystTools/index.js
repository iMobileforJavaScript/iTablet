import AnalystTools from './AnalystTools'
import { connect } from 'react-redux'
import { setBackAction, removeBackAction } from '../../../../models/backActions'
import { setMapLegend } from '../../../../models/setting'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {
  setMapLegend,
  setBackAction,
  removeBackAction,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalystTools)
