/**
 * Created by imobile-xzy on 2019/3/4.
 */
// eslint-disable-next-line import/named
import { InformSpot } from './InformSpot'
import { connect } from 'react-redux'
import { setUser } from '../../models/user'
import { addChat } from '../../models/chat'

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
)(InformSpot)
