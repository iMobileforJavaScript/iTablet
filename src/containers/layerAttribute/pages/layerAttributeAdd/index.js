import { connect } from 'react-redux'
import LayerAttributeAdd from './LayerAttributeAdd'
import { setCurrentAttribute } from '../../../../models/layers'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
})

const mapDispatchToProps = {
  setCurrentAttribute,
}
export default connect(mapStateToProps, mapDispatchToProps)(LayerAttributeAdd)
