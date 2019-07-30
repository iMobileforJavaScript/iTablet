import TouchProgress from './TouchProgress'
import { setCurrentAttribute } from '../../../../models/layers'
import { connect } from 'react-redux'
import { setMapLegend } from '../../../../models/setting'
const mapStateToProps = state => ({
  currentLayer: state.layers.toJS().currentLayer,
  mapLegend: state.setting.toJS().mapLegend,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  setMapLegend,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TouchProgress)
