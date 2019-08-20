import NavigationPoiView from './NavigationPoiView'
import { connect } from 'react-redux'
import {
  setMapNavigation,
  setMapNavigationShow,
} from '../../../../models/setting'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  mapNavigationShow: state.setting.toJS().mapNavigationShow,
})
const mapDispatchToProps = {
  setMapNavigation,
  setMapNavigationShow,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationPoiView)
