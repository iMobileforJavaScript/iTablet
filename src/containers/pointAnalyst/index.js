import PointAnalyst from './pointAnalyst'
import { connect } from 'react-redux'
import { setMapNavigation, setNavigationChangeAR } from '../../models/setting'
import { setMapSearchHistory } from '../../models/histories'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  navigationChangeAR: state.setting.toJS().navigationChangeAR,
  mapSearchHistory: state.histories.toJS().mapSearchHistory,
})
const mapDispatchToProps = {
  setMapNavigation,
  setNavigationChangeAR,
  setMapSearchHistory,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PointAnalyst)
