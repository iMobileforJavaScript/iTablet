import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import NavigationService from '../../../NavigationService'
import styles from './styles'
import { getLanguage } from '../../../../language/index'
export default class AboutITablet extends Component {
  props: {
    language:Object,
    navigation: Object,
    device: Object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  offcial = () => {
    NavigationService.navigate('Protocol', { type: 'offcial' })
  }

  Protocol = () => {
    NavigationService.navigate('Protocol', { type: 'protocol' })
  }

  render() {
    let marginLeft = {
      position: 'absolute',
      left: 0.0417 * this.props.device.width,
    }
    let marginRight = {
      position: 'absolute',
      right: 0.0417 * this.props.device.width,
    }
    let footerBottom = {
      position: 'absolute',
      bottom: 0.1355 * this.props.device.height,
    }
    let informationBottom = {
      position: 'absolute',
      bottom: 0.0852 * this.props.device.height,
    }
    let iTablet = require('../../../../assets/home/Frenchgrey/icon_about_iTablet.png')
    return (
      <Container
        headerProps={{
          title:getLanguage(this.props.language).Profile.ABOUT+' SuperMap iTablet',
          navigation: this.props.navigation,
        }}
        style={styles.container}
      >
        <View
          style={[
            styles.header,
            { marginTop: 0.0648 * this.props.device.height },
          ]}
        >
          <Image style={styles.iTablet} source={iTablet} />
          <Text
            style={[
              styles.headerTitle,
              { marginTop: 0.0231 * this.props.device.height },
            ]}
          >
            SuperMap iTablet
          </Text>
          <Text style={styles.version}>v 2.0</Text>
        </View>
        <View
          style={[
            styles.contentView,
            {
              width: this.props.device.width,
              marginTop: 0.0528 * this.props.device.height,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.support,
              { height: 0.06 * this.props.device.height },
            ]}
          >
            <Text style={[styles.supportTitle, marginLeft]}>
              {getLanguage(this.props.language).Profile.SERVICE_HOTLINE}
              {/* 技术支持与服务 */}
            </Text>
            <Text style={[styles.phone, marginRight]}>400-8900-866</Text>
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
          <TouchableOpacity
            style={[
              styles.consult,
              { height: 0.06 * this.props.device.height },
            ]}
          >
            <Text style={[styles.consultTitle, marginLeft]}>
             {getLanguage(this.props.language).Profile.SALES_CONSULTATION}
              {/* 销售咨询 */}
              </Text>
            <Text style={[styles.phone, marginRight]}>01059896655转6156</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.footerView, footerBottom]}>
          <TouchableOpacity style={[styles.offcial]} onPress={this.offcial}>
            {/* <Text
              style={[styles.footerItem, { position: 'absolute', right: 0 }]}
            >
              官网
            </Text> */}
            <Text style={styles.footerItem}>
            {getLanguage(this.props.language).Profile.BUSINESS_WEBSITE}
              {/* 进入官网 */}
              </Text>
          </TouchableOpacity>
          <View
            style={[
              styles.cloumSeparator,
              {
                marginLeft: 0.0347 * this.props.device.width,
                marginRight: 0.0347 * this.props.device.width,
              },
            ]}
          />
          <TouchableOpacity style={[styles.protocol]} onPress={this.Protocol}>
            <Text style={styles.footerItem}>
            {getLanguage(this.props.language).Profile.PRIVACY_POLICY}
              {/* 服务协议 */}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.informationView, informationBottom]}>
          <Text style={styles.information}>
            Copyright 1997-2019 SuperMap Software Co.,Ltd.All rights reserved
          </Text>
        </View>
      </Container>
    )
  }
}
