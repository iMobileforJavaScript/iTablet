import { connect } from 'react-redux'
import LayerAttribute from './LayerAttribute'
import {
  setCurrentAttribute,
  getAttributes,
  setAttributes,
  setLayerAttributes,
} from '../../../../models/layers'
import { closeMap } from '../../../../models/map'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
  map: state.map.toJS(),
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {
  setCurrentAttribute,
  getAttributes,
  setAttributes,
  closeMap,
  setLayerAttributes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttribute)
