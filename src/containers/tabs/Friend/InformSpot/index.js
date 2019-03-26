import InformSpot from './InformSpot'
//import { setUser } from '../../../../models/user'
//import { addChat } from '../../../../models/chat'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  user: state.user.toJS(),
  chat: state.chat.toJS(),
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InformSpot)
