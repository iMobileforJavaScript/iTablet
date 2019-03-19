import Map3D from './Map3D'
import { connect } from 'react-redux'
import {
  setEditLayer,
  setCurrentAttribute,
  refreshLayer3dList,
  setAttributes,
} from '../../../../models/layers'
import {
  setLatestMap,
  exportmap3DWorkspace,
  importSceneWorkspace,
} from '../../../../models/map'
import { setSharing } from '../../../../models/online'
const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
  latestMap: state.map.toJS().latestMap,
  user: state.user.toJS(),
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
  device: state.device.toJS().device,
  online: state.online.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setLatestMap,
  setCurrentAttribute,
  exportmap3DWorkspace,
  importSceneWorkspace,
  setSharing,
  refreshLayer3dList,
  setAttributes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map3D)
