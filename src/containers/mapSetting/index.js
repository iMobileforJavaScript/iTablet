import MapSetting from './MapSetting'
import { connect } from 'react-redux'
import { setSettingData } from '../../models/setting'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  mapSetting: state.setting.toJS().mapSetting,
})

const mapDispatchToProps = {
  setSettingData,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapSetting)
