import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import NavigationService from '../../../NavigationService'
import styles from './styles'
export default class AboutITablet extends Component {
  props: {
    navigation: Object,
    device: Object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  Protocol = () => {
    NavigationService.navigate('Protocol')
  }

  render() {
    let iTablet = require('../../../../assets/home/Frenchgrey/icon_about_iTablet.png')
    return (
      <Container
        headerProps={{
          title: '关于 SuperMap iTablet',
          navigation: this.props.navigation,
        }}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image style={styles.iTablet} source={iTablet} />
          <Text style={styles.headerTitle}>SuperMap iTablet</Text>
          <Text style={styles.version}>v 2.0</Text>
        </View>
        <View style={styles.contentView}>
          <TouchableOpacity style={styles.support}>
            <Text style={styles.supportTitle}>技术支持与服务</Text>
            <Text style={styles.phone}>400-8900-866</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.separator,
              {
                width: 0.956 * this.props.device.width,
                marginLeft: 0.022 * this.props.device.width,
              },
            ]}
          />
          <TouchableOpacity style={styles.consult}>
            <Text style={styles.consultTitle}>销售咨询</Text>
            <Text style={styles.phone}>01059896655转6156</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerView}>
          <TouchableOpacity style={styles.offcial}>
            <Text
              style={[styles.footerItem, { position: 'absolute', right: 0 }]}
            >
              官网
            </Text>
          </TouchableOpacity>
          <View style={styles.separatorView}>
            <View style={styles.cloumSeparator} />
          </View>
          <TouchableOpacity style={styles.protocol} onPress={this.Protocol}>
            <Text style={styles.footerItem}>服务协议</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.informationView}>
          <Text style={styles.information}>
            Copyright 1997-2018 SuperMap Software Co.,Ltd.All rights reserved
          </Text>
        </View>
      </Container>
    )
  }
}
