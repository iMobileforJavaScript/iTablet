import { connect } from 'react-redux'
import MapCut from './MapCut'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(MapCut)
