import Setting from './setting'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})
export default connect(
  mapStateToProps,
  {},
)(Setting)
