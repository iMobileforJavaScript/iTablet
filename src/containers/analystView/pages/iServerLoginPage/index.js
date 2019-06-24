import { connect } from 'react-redux'
import IServerLoginPage from './IServerLoginPage'
import { loginIServer } from '../../../../models/online'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  iServerData: state.online.toJS().iServerData,
})

const mapDispatchToProps = {
  loginIServer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IServerLoginPage)
