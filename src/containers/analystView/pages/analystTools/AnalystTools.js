import React, { Component } from 'react'
import { Platform } from 'react-native'
import { Container, TableList, MTBtn } from '../../../../components'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import styles from './styles'
import analystData from './analystData'
import { setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { color } from '../../../../styles'
import { SMediaCollector } from 'imobile_for_reactnative'

export default class AnalystTools extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
    language: String,
    setMapLegend: () => {},
    setBackAction: () => {},
    removeBackAction: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: analystData.getData(this.props.language),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        data: analystData.getData(this.props.language),
      })
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.navigation.state.routeName,
      })
    }
    this.props.setMapLegend(false)

    // 移除多媒体采集监听
    SMediaCollector.removeListener()

    // 移除多媒体采集Callout
    SMediaCollector.removeMedias()
  }

  // goToMapView = () => {
  //   this.props.navigation && this.props.navigation.navigate('MapAnalystView')
  // }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    let column = this.state.column
    return (
      <MTBtn
        style={{ width: this.props.device.width / column }}
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={color.font_color_white}
        textStyle={{ fontSize: setSpText(20) }}
        image={item.image}
        background={item.background}
        onPress={() => {
          item.action({
            // cb: this.goToMapView,
          })
        }}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={constants.MAP_ANALYST}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Module.DATA_ANALYSIS,
          navigation: this.props.navigation,
        }}
      >
        <TableList
          data={this.state.data}
          type={'scroll'}
          numColumns={this.props.device.orientation ? 4 : 8}
          renderCell={this._renderItem}
          device={this.props.device}
        />
        {this.renderToolBar()}
      </Container>
    )
  }
}
