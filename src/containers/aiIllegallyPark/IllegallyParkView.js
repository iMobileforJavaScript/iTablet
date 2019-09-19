import * as React from 'react'
import { InteractionManager } from 'react-native'
import NavigationService from '../../containers/NavigationService'
import Orientation from 'react-native-orientation'
// import styles from './styles'
import { Container } from '../../components'
//eslint-disable-next-line
import { SMIllegallyParkView } from 'imobile_for_reactnative'
import { getLanguage } from '../../language'

/*
 * 违章采集界面
 */
export default class IllegallyParkView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.datasourceAlias = params.datasourceAlias || ''
    this.datasetName = params.datasetName || ''

    this.state = {
      mediaName: params.mediaName || '',
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {}.bind(this)())
    })
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations()
    //移除监听
  }

  back = () => {
    NavigationService.goBack()
    return true
  }

  save = async () => {}

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_ILLEGALLY_PARK_COLLECT,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMIllegallyParkView
          ref={ref => (this.SMIllegallyParkView = ref)}
          language={this.props.language}
        />
      </Container>
    )
  }
}
