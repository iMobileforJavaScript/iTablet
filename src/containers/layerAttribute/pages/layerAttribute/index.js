import { connect } from 'react-redux'
import LayerAttribute from './LayerAttribute'
import { setCurrentAttribute, getAttributes } from '../../../../models/layers'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  getAttributes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttribute)
