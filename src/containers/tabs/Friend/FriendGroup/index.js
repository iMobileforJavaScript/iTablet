/**
 * Created by imobile-xzy on 2019/3/4.
 */
import FriendGroup from './FriendGroup'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  chat: state.chat.toJS(),
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FriendGroup)
