import OnlineAnalystView from './OnlineAnalystView'
import { connect } from 'react-redux'
import { getLayers } from '../../../../models/layers'
import { getDatasetInfoFromIServer } from '../../../../models/online'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
  iServerData: state.online.toJS().iServerData,
})

const mapDispatchToProps = {
  getLayers,
  getDatasetInfoFromIServer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnlineAnalystView)
