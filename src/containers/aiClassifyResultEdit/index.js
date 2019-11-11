import { connect } from 'react-redux'
import ClassifyResultEditView from './ClassifyResultEditView'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(ClassifyResultEditView)
