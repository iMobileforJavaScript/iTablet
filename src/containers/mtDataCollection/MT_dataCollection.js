import * as React from 'react'
import { View, Text } from 'react-native'

import { Container, EmptyView } from '../../components'

import styles from './styles'

export default class MT_dataCollection extends React.Component {

  props: {
    navigation: Object,
  }

  render() {
    return (
      <Container
        headerProps={{
          title: '数据采集',
          navigation: this.props.navigation,
        }}>
        <EmptyView title={"功能待完善"} />
      </Container>
    )
  }
}