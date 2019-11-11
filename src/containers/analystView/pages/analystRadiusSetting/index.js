import { connect } from 'react-redux'
import AnalystRadioSetting from './AnalystRadiusSetting'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  [],
)(AnalystRadioSetting)
