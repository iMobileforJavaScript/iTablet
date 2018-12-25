import Theme_layerManager from './Theme_layerManager'
import { connect } from 'react-redux'
import { setEditLayer, setCurrentLayer, getLayers } from '../../models/layers'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
  layers: state.layers.toJS().layers,
})

const mapDispatchToProps = {
  setEditLayer,
  setCurrentLayer,
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Theme_layerManager)
