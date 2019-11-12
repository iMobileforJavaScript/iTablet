/**
 * 插值分析 具体插值方法实施界面
 */
import InterpolationAnalystDetailView from './InterpolationAnalystDetailView'
import { connect } from 'react-redux'
import { getLayers } from '../../../../models/layers'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InterpolationAnalystDetailView)
