import Map3D from './Map3D'
import { connect } from 'react-redux'
import {
  setEditLayer,
  setCurrentAttribute,
  setAttributes,
} from '../../../../models/layers'
import { setLatestMap } from '../../../../models/map'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
  latestMap: state.map.toJS().latestMap,
  user: state.user.toJS(),
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
})

const mapDispatchToProps = {
  setEditLayer,
  setLatestMap,
  setCurrentAttribute,
  setAttributes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map3D)
