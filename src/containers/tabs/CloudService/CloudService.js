import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Container, EmptyView } from '../../../components'


export default class CloudService extends Component {

  props: {
    navigation: Object,
    image: any,
  }

  render() {return (
    <Container
      style={styles.container}
      headerProps={{
        title: '云服务',
        navigation: this.props.navigation,
        headerRight: [

        ],
        withoutBack: true,
      }}>
      <EmptyView title={'待完善'}/>
    </Container>
  )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
