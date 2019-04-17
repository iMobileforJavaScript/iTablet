import { connect } from 'react-redux'
import MapCut from './MapCut'
import { getLayers } from '../../../../models/layers'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  map: state.map.toJS(),
  layers: state.layers.toJS().layers,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapCut)
