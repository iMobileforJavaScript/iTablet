import React, { Component } from 'react'
import { Text } from 'react-native'
import Container from '../../../../components/Container'
export default class Setting extends Component {
  props: {
    navigation: Object,
  }
  render() {
    return (
      <Container
        headerProps={{
          title: '设置',
          navigation: this.props.navigation,
        }}
      >
        <Text>设置</Text>
      </Container>
    )
  }
}
