import React, { Component } from 'react'
import { Text } from 'react-native'
import { Container } from '../../../../components'
export default class AboutITablet extends Component {
  props: {
    navigation: Object,
  }
  render() {
    return (
      <Container
        headerProps={{
          title: '关于iTablet',
          navigation: this.props.navigation,
        }}
      >
        <Text>iTablet</Text>
      </Container>
    )
  }
}
