/**
 * Created by imobile-xzy on 2019/3/4.
 */
import Friend from './Friend'
import Chat from './Chat'
import ManageFriend from './Chat/ManageFriend'
import ManageGroup from './Chat/ManageGroup'
import SelectModule from './Chat/SelectModule'
import AddFriend from './AddFriend'
import InformMessage from './FriendMessage/InformMessage'
import CreateGroupChat from './FriendGroup/CreateGroupChat'
import GroupMemberList from './FriendGroup/GroupMemberList'
import RecommendFriend from './RecommendFriend'
import MsgConstant from './MsgConstant'
import SelectFriend from './SelectFriend'
import { SimpleDialog, ImageViewer } from './Component'
import { openWorkspace, closeWorkspace } from '../../../models/map'
import { connect } from 'react-redux'
import { setUser } from '../../../models/user'
import { addChat, editChat, setConsumer } from '../../../models/chat'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  chat: state.chat.toJS(),
  appConfig: state.appConfig.toJS(),
})

const mapDispatchToProps = {
  setUser,
  addChat,
  //addUnreadMessage,
  editChat,
  setConsumer,
  openWorkspace,
  closeWorkspace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Friend)

export {
  Chat,
  AddFriend,
  InformMessage,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  MsgConstant,
  SelectFriend,
  SimpleDialog,
  ImageViewer,
}
