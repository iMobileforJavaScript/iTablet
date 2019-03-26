/**
 * Created by imobile-xzy on 2019/3/4.
 */
import Friend from './Friend'
import Chat from './Chat/Chat'
import AddFriend from './AddFriend'
import InformMessage from './FriendMessage/InformMessage'
import { connect } from 'react-redux'
import { setUser } from '../../../models/user'
import { addChat } from '../../../models/chat'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  chat: state.chat.toJS(),
})

const mapDispatchToProps = {
  setUser,
  addChat,
  //addUnreadMessage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Friend)

export { Chat, AddFriend, InformMessage }
