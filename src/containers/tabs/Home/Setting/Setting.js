import React, { Component } from 'react'
import { View } from 'react-native'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import RenderSettingItem from './RenderSettingItem'
import { getLanguage } from '../../../../language/index'
export default class Setting extends Component {
  props: {
    navigation: Object,
  }
  _renderItem = label => {
    return <RenderSettingItem label={label} />
  }
  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.SETTINGS,
          //'设置',
          navigation: this.props.navigation,
        }}
      >
        <View style={{ flex: 1, backgroundColor: color.content_white }}>
          {this._renderItem('隐藏状态栏')}
        </View>
      </Container>
    )
  }
}
