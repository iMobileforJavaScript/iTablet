import MyBaseMap from './MyBaseMap'
import { connect } from 'react-redux'
import { setBaseMap } from '../../../../models/map'
const mapStateToProps = state => ({
  baseMaps: state.map.toJS().baseMaps,
  user: state.user.toJS(),
})
const mapDispatchToProps = {
  setBaseMap,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyBaseMap)
