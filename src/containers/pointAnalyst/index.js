import PointAnalyst from './pointAnalyst'
import { connect } from 'react-redux'
import { setMapNavigation } from '../../models/setting'
import { setMapSearchHistory } from '../../models/histories'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  mapSearchHistory: state.histories.toJS().mapSearchHistory,
})
const mapDispatchToProps = {
  setMapNavigation,
  setMapSearchHistory,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PointAnalyst)
