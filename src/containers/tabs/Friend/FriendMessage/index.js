/**
 * Created by imobile-xzy on 2019/3/4.
 */

import { connect } from 'react-redux'
import { addChat } from '../../../../models/chat'
import FriendMessage from './FriendMessage'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  chat: state.chat.toJS(),
})

const mapDispatchToProps = {
  addChat,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FriendMessage)
