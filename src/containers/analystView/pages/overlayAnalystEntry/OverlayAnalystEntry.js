import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { Container } from '../../../../components'
import styles from './styles'
import NavigationService from '../../../NavigationService'
import { OverlayAnalystItem } from '../../components'
import { ConstAnalyst } from '../../../../constants'
import overlayAnalystEntryData from './overlayAnalystEntryData'

export default class OverlayAnalystEntry extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
    currentUser: Object,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.cb = params && params.cb
    this.state = {
      data: overlayAnalystEntryData.getData() || [],
    }
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
      <OverlayAnalystItem
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
          title: ConstAnalyst.OVERLAY_ANALYST,
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
