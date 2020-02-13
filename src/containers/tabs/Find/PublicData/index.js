import PublicData from './PublicData'
import { updateDownList, removeItemOfDownList } from '../../../../models/online'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  down: state.online.toJS().down,
})
const mapDispatchToProps = {
  updateDownList,
  removeItemOfDownList,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicData)
