import MT_layerManager from './MT_layerManager'
import { connect } from 'react-redux'
import { setEditLayer, setCurrentLayer, getLayers } from '../../models/layers'
import { closeMap } from '../../models/map'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
  layers: state.layers.toJS().layers,
  map: state.map.toJS(),
  collection: state.collection.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setCurrentLayer,
  getLayers,
  closeMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MT_layerManager)
