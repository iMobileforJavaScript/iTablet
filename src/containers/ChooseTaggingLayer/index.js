import ChooseTaggingLayer from './ChooseTaggingLayer'
import { connect } from 'react-redux'
import { setCurrentLayer } from '../../models/layers'

const mapDispatchToProps = {
  setCurrentLayer,
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseTaggingLayer)
