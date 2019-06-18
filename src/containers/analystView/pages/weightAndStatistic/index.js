import { connect } from 'react-redux'
import WeightAndStatistic from './WeightAndStatistic'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  iServerData: state.online.toJS().iServerData,
})

export default connect(
  mapStateToProps,
  [],
)(WeightAndStatistic)
