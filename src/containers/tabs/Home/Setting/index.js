import Setting from './Setting'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  appConfig: state.appConfig.toJS(),
})

export default connect(
  mapStateToProps,
  {},
)(Setting)
