import MyLable from './MyLable'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})
export default connect(
  mapStateToProps,
  {},
)(MyLable)
