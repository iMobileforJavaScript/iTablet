import { connect } from 'react-redux'
import AnalystRangePage from './AnalystRangePage'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  [],
)(AnalystRangePage)
