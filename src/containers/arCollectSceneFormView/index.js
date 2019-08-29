import { connect } from 'react-redux'
import CollectSceneFormView from './CollectSceneFormView'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(CollectSceneFormView)
