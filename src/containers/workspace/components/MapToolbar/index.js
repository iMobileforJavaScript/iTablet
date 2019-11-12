import MapToolbar from './MapToolbar'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapToolbar)
//export default MapToolbar
