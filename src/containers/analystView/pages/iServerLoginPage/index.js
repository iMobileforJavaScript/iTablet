import { connect } from 'react-redux'
import IServerLoginPage from './IServerLoginPage'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  [],
)(IServerLoginPage)
