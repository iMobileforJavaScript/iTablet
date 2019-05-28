import { connect } from 'react-redux'
import Camera from './Camera'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.user.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(Camera)
