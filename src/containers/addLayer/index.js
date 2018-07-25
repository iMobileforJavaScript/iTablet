import { connect } from 'react-redux'
import AddLayer from './Add_Layer'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

export default connect(mapStateToProps,[])(AddLayer)
