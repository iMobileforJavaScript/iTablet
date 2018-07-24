import AddLayer from './Add_Layer'
import { connect } from 'react-redux'
const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})
export default connect(mapStateToProps, {})(AddLayer);
