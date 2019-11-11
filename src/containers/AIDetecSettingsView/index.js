import { connect } from 'react-redux'
import AIDetecSettingsView from './AIDetecSettingsView'
import { downloadFile } from '../../models/down'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  downloads: state.down.toJS().downloads,
})

const mapDispatchToProps = {
  downloadFile,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AIDetecSettingsView)
