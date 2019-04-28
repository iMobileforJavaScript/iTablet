import { connect } from 'react-redux'
import LayerAttributeSearch from './LayerAttributeSearch'
import {
  setCurrentAttribute,
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
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  closeMap,
  setLayerAttributes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttributeSearch)
