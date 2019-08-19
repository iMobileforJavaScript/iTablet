import NavigationView from './NavigationView'
import { connect } from 'react-redux'
import { setMapNavigation } from '../../../../models/setting'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
})
const mapDispatchToProps = {
  setMapNavigation,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationView)
