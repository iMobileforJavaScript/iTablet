import { connect } from 'react-redux'
import IServerLoginPage from './SourceDatasetPage'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  [],
)(IServerLoginPage)
