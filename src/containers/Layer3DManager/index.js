import Layer3DManager from './Layer3DManager'
import { connect } from 'react-redux'
import { refreshLayer3dList } from '../../models/layers'

const mapStateToProps = state => ({
  layer3dList: state.layers.toJS().layer3dList,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  refreshLayer3dList,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layer3DManager)
