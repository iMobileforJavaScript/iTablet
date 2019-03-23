import InformSpot from './InformSpot'
import { setUser } from '../../../../models/user'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InformSpot)
