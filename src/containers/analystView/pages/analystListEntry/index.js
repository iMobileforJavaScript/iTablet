import AnalystListEntry from './AnalystListEntry'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalystListEntry)
