import MyLocalData from './MyLocalData'
import { openTemplate } from '../../../../models/template'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
  openTemplate,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLocalData)
