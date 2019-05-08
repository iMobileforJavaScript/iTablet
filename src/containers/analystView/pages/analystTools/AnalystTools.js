import React, { Component } from 'react'
import { Container, TableList, MTBtn } from '../../../../components'
import { MAP_MODULE } from '../../../../constants/ConstModule'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import styles from './styles'
import analystData from './analystData'
import { setSpText } from '../../../../utils'
import { color } from '../../../../styles'
export default class AnalystTools extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: analystData.getData(),
    }
  }

  goToMapView = () => {
    this.props.navigation && this.props.navigation.navigate('MapAnalystView')
  }

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
            cb: this.goToMapView,
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
          title: MAP_MODULE.MAP_ANALYST,
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
