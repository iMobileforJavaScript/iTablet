import LocalAnalystView from './LocalAnalystView'
import { connect } from 'react-redux'
import { getLayers } from '../../../../models/layers'
import { setAnalystParams } from '../../../../models/analyst'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  getLayers,
  setAnalystParams,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocalAnalystView)
