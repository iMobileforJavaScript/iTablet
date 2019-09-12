import NavigationView from './NavigationView'
import { connect } from 'react-redux'
import {
  setMapNavigation,
  setMapSelectPoint,
  setNavigationHistory,
} from '../../../../models/setting'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  mapSelectPoint: state.setting.toJS().mapSelectPoint,
  navigationhistory: state.setting.toJS().navigationhistory,
})
const mapDispatchToProps = {
  setMapNavigation,
  setMapSelectPoint,
  setNavigationHistory,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationView)
