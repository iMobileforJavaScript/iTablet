import TouchProgress from './TouchProgress'
import { setCurrentAttribute } from '../../../../models/layers'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  currentLayer: state.layers.toJS().currentLayer,
})

const mapDispatchToProps = {
  setCurrentAttribute,
}


export default  connect(
  mapStateToProps,
  mapDispatchToProps,
)(TouchProgress)
