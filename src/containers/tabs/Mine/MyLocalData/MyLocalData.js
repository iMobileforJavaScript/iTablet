import React, { Component } from 'react'
import { View, Text } from 'react-native'
import Container from '../../../../components/Container/index'

export default class MyLocalData extends Component {
  props: {
    navigation: Object,
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '我的iTablet',
          withoutBack: false,
          navigation: this.props.navigation,
          // headerRight: (
          //   <BtnOne
          //     image={require('../../../assets/public/icon-setting-white.png')}
          //     onPress={}
          //   />
          // ),
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text>本地数据</Text>
        </View>
      </Container>
    )
  }
}
