import { connect } from 'react-redux'
import SelectLoginView from './SelectLogin'
import Login from './Login'
import IPortalLogin from './IPortalLogin'

const mapStateToProps = state => ({
  appConfig: state.appConfig.toJS(),
})

const mapDispatchToProps = {}

const SelectLogin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectLoginView)

export { SelectLogin, Login, IPortalLogin }
