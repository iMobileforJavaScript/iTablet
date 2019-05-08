import OverlayAnalystView from './OverlayAnalystView'
import { connect } from 'react-redux'
import { getLayers } from '../../../../models/layers'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverlayAnalystView)
