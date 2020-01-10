import PublicData from './PublicData'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})
const mapDispatchToProps = {
  //   setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicData)
