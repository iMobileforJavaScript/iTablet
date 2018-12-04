import MT_layerManager from './MT_layerManager'
import { connect } from 'react-redux'
import { setEditLayer, setCurrentLayer } from '../../models/layers'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
})

const mapDispatchToProps = {
  setEditLayer,
  setCurrentLayer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MT_layerManager)
