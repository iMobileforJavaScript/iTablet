import { connect } from 'react-redux'
import InputPage from './InputPage'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(InputPage)
