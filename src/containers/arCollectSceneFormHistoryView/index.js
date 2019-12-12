import { connect } from 'react-redux'
import CollectSceneFormHistoryView from './CollectSceneFormHistoryView'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(CollectSceneFormHistoryView)
