import PointAnalyst from './pointAnalyst'
import { connect } from 'react-redux'
import { setMapNavigation, setNavigationChangeAR } from '../../models/setting'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  navigationChangeAR: state.setting.toJS().navigationChangeAR,
})
const mapDispatchToProps = {
  setMapNavigation,
  setNavigationChangeAR,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PointAnalyst)
