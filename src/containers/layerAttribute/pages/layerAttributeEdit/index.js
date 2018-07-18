import { connect } from 'react-redux'
import LayerAttributeEdit from './LayerAttributeEdit'
import { setCurrentAttribute } from '../../../../models/layers'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
})

const mapDispatchToProps = {
  setCurrentAttribute,
}
export default connect(mapStateToProps, mapDispatchToProps)(LayerAttributeEdit)
