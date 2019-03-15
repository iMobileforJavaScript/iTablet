import MyLabel from './MyLabel'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})
export default connect(
  mapStateToProps,
  {},
)(MyLabel)
