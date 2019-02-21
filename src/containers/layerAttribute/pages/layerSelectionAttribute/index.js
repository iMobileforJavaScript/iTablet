import { connect } from 'react-redux'
// import LayerSelectionAttribute from './LayerSelectionAttribute'
import LayerAttributeTabs from './LayerAttributeTabs'
import {
  setCurrentAttribute,
  setLayerAttributes,
} from '../../../../models/layers'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  attributes: state.layers.toJS().attributes,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  map: state.map.toJS(),
})

const mapDispatchToProps = {
  setCurrentAttribute,
  setLayerAttributes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttributeTabs)
