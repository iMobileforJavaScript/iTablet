import AnalystTools from './AnalystTools'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalystTools)
