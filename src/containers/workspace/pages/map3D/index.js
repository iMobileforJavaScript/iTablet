import Map3D from './Map3D'
import { connect } from 'react-redux'
import {
  setEditLayer,
  setCurrentAttribute,
  setAttributes,
} from '../../../../models/layers'
import {
  setLatestMap,
  exportmap3DWorkspace,
  importSceneWorkspace,
} from '../../../../models/map'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
  latestMap: state.map.toJS().latestMap,
  user: state.user.toJS(),
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setEditLayer,
  setLatestMap,
  setCurrentAttribute,
  setAttributes,
  exportmap3DWorkspace,
  importSceneWorkspace,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map3D)
