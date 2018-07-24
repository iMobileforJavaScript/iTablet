import MT_layerManager from './MT_layerManager'
import { connect } from 'react-redux'
import { setEditLayer } from '../../models/layers'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
})

const mapDispatchToProps = {
  setEditLayer,
}

export default connect(mapStateToProps, mapDispatchToProps)(MT_layerManager)