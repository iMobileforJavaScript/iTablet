import { connect } from 'react-redux'
import MeasureView from './MeasureView'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(MeasureView)
