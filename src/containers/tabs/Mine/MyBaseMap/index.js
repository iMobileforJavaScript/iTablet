import MyBaseMap from './MyBaseMap'
import { connect } from 'react-redux'
import { setBaseMap } from '../../../../models/map'
const mapStateToProps = state => ({
  baseMaps: state.map.toJS().baseMaps,
})
const mapDispatchToProps = {
  setBaseMap,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyBaseMap)
