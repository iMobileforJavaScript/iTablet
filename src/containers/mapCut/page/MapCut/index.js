import { connect } from 'react-redux'
import MapCut from './MapCut'
import { getLayers } from '../../../../models/layers'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  layers: state.layers.toJS().layers,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapCut)
