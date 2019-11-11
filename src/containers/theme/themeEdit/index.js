import { connect } from 'react-redux'
import ThemeEdit from './ThemeEdit'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeEdit)
