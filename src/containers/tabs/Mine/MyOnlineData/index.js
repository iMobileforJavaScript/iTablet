import MyOnlineData from './MyOnlineData'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
import { updateDownList } from '../../../../models/online'
import { importWorkspace } from '../../../../models/template'
const mapStateToProps = state => ({
  user: state.user.toJS(),
  down: state.online.toJS().down,
})

const mapDispatchToProps = {
  setUser,
  importWorkspace,
  updateDownList,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyOnlineData)
