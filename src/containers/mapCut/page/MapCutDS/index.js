import MapCutDS from './MapCutDS'
import { connect } from 'react-redux'
import { getLayers } from '../../../../models/layers'

const mapStateToProps = state => ({
  layers: state.layers.toJS().layers,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapCutDS)
