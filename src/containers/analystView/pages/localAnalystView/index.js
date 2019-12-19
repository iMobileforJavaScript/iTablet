import LocalAnalystView from './LocalAnalystView'
import { connect } from 'react-redux'
import { getLayers } from '../../../../models/layers'
import { setAnalystParams } from '../../../../models/analyst'
import { getUdbAndDs } from '../../../../models/localData'
import { closeMap } from '../../../../models/map'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
  userUdbAndDs: state.localData.toJS().userUdbAndDs,
})

const mapDispatchToProps = {
  getLayers,
  setAnalystParams,
  getUdbAndDs,
  closeMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocalAnalystView)
