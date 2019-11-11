import Register from './Register'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Register)
