import NavigationView from './NavigationView'
import { connect } from 'react-redux'
import { setMapNavigation, setMapSelectPoint } from '../../../../models/setting'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  mapSelectPoint: state.setting.toJS().mapSelectPoint,
})
const mapDispatchToProps = {
  setMapNavigation,
  setMapSelectPoint,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationView)
