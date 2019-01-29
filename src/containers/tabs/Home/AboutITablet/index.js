import { connect } from 'react-redux'
import AboutITablet from './AboutITablet'
const mapStateToProps = state => ({
  device: state.device.toJS().device,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutITablet)
