import { connect } from 'react-redux'
import InputPage from './InputPage'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  [],
)(InputPage)
