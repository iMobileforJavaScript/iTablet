import OverlayAnalystEntry from './OverlayAnalystEntry'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverlayAnalystEntry)
