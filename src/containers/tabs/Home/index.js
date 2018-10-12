import { connect } from 'react-redux'
import Home from './Home'

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
