import ChangeArView from './ChangeArView'
import { connect } from 'react-redux'
import {
  setMap2Dto3D,
  setMapIs3D,
  setMapNavigationShow,
} from '../../../../models/setting'

const mapStateToProps = state => ({
  map2Dto3D: state.setting.toJS().map2Dto3D,
  mapIs3D: state.setting.toJS().mapIs3D,
  mapNavigationShow: state.setting.toJS().mapNavigationShow,
})

const mapDispatchToProps = {
  setMap2Dto3D,
  setMapIs3D,
  setMapNavigationShow,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeArView)
