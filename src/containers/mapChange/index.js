import { connect } from 'react-redux'
import MapChange from './MapChange'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapChange)
