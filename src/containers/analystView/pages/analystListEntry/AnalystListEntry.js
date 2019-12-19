import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { Container } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import styles from './styles'
import NavigationService from '../../../NavigationService'
import { AnalystListItem } from '../../components'
// import { Analyst_Types } from '../../AnalystType'
import AnalystEntryData from './AnalystEntryData'

export default class AnalystListEntry extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
    currentUser: Object,
    language: Object,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.cb = params && params.cb
    this.type =
      (params && params.type) || ConstToolType.MAP_ANALYSIS_ONLINE_ANALYSIS
    // TODO 根据类型获取数据列表
    this.state = {
      title: (params && params.title) || '',
      data: this.getData(this.type),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        data: this.getData(this.type),
      })
    }
  }

  getData = type => {
    let data = []
    switch (type) {
      case ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH:
        data =
          AnalystEntryData.getLocalAnalystEntryData(
            this.props.language,
            ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH,
          ) || []
        break
      case ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
        data =
          AnalystEntryData.getLocalAnalystEntryData(
            this.props.language,
            ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
          ) || []
        break
      case ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH:
        data =
          AnalystEntryData.getLocalAnalystEntryData(
            this.props.language,
            ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH,
          ) || []
        break
      case ConstToolType.MAP_ANALYSIS_ONLINE_ANALYSIS:
        data = AnalystEntryData.getOnlineAnalystData(this.props.language) || []
        break
      case ConstToolType.MAP_ANALYSIS_OVERLAY_ANALYSIS:
      default:
        data = AnalystEntryData.getOverlayAnalystData(this.props.language) || []
        break
    }

    return data || []
  }

  back = () => {
    NavigationService.goBack()
  }

  _action = item => {
    if (item && item.action && typeof item.action === 'function') {
      item.action(this.cb)
    }
  }

  _renderItem = ({ item }) => {
    return (
      <AnalystListItem
        title={item.title}
        icon={item.image}
        onPress={() => this._action(item)}
      />
    )
  }

  _keyExtractor = (item, index) => item.title + '_' + index

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        <FlatList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          data={this.state.data}
        />
      </Container>
    )
  }
}
