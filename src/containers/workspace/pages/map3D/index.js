import Map3D from './Map3D'
import { connect } from 'react-redux'
import { setEditLayer } from '../../../../models/layers'
import { setLatestMap } from '../../../../models/map'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
  latestMap: state.map.toJS().latestMap,
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setLatestMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map3D)
