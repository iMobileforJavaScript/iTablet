import MapLoad from './MapLoad'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

export default connect(mapStateToProps, {})(MapLoad)