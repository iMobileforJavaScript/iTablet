import NewDSet from './NewDSet'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDSet)