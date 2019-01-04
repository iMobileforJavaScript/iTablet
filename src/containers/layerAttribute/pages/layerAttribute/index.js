import { connect } from 'react-redux'
import LayerAttribute from './LayerAttribute'
import {
  setCurrentAttribute,
  getAttributes,
  setAttributes,
} from '../../../../models/layers'
import { closeMap } from '../../../../models/map'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  getAttributes,
  setAttributes,
  closeMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttribute)
