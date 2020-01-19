import MyColor from './MyColor'
import { connect } from 'react-redux'
import { setUser } from '../../../../models/user'
import { uploading } from '../../../../models/online'
const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  upload: state.online.toJS().upload,
})

const mapDispatchToProps = {
  setUser,
  uploading,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyColor)
