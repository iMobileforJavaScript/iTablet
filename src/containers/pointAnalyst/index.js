import PointAnalyst from './pointAnalyst'
import { connect } from 'react-redux'
import { setMapNavigation } from '../../models/setting'
import { setMapSearchHistory } from '../../models/history'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  mapSearchHistory: state.history.toJS().mapSearchHistory,
})
const mapDispatchToProps = {
  setMapNavigation,
  setMapSearchHistory,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PointAnalyst)
