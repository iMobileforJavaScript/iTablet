import { connect } from 'react-redux'
import { setLanguage } from '../../models/setting'
import LanguageSetting from './LanguageSetting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  autoLanguage: state.setting.toJS().autoLanguage,
})
const mapDispatchToProps = {
  setLanguage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageSetting)
