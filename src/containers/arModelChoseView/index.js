import { connect } from 'react-redux'
import ModelChoseView from './ModelChoseView'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(ModelChoseView)
