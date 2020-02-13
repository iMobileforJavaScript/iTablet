import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import NavigationService from '../../../NavigationService'
import styles from './styles'
import { getLanguage } from '../../../../language/index'
import { getPublicAssets } from '../../../../assets'
import { scaleSize } from '../../../../utils'
export default class AboutITablet extends Component {
  props: {
    language: string,
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

  Privacy = () => {
    NavigationService.navigate('Protocol', { type: 'Privacy' })
  }

  userHelp = () => {
    NavigationService.navigate('Protocol', { type: 'userHelp' })
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
    let imgMarginRight = {
      position: 'absolute',
      right: 0.04 * this.props.device.width,
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
          title:
            getLanguage(this.props.language).Profile.ABOUT +
            ' SuperMap iTablet',
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
          <Text style={styles.version}>10i</Text>
        </View>
        <View
          style={[
            styles.contentView,
            {
              width: '100%',
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
            <Text style={[styles.phone, marginRight]}>
              01059896655
              {this.props.language === 'CN' ? '转' : '-'}
              6156
            </Text>
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
            onPress={this.userHelp}
          >
            <Text style={[styles.consultTitle, marginLeft]}>
              {/* {getLanguage(this.props.language).Profile.SALES_CONSULTATION} */}
              {/* 销售咨询 */}
              {getLanguage(this.props.language).Profile.HELP_MANUAL}
              {/* {'使用帮助'} */}
            </Text>
            <Image
              style={[
                imgMarginRight,
                { width: scaleSize(40), height: scaleSize(40) },
              ]}
              source={getPublicAssets().common.icon_about_itablet_more}
              resizeMode={'contain'}
            />
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
              {getLanguage(this.props.language).Profile.SERVICE_AGREEMENT}
              {/* 服务协议 */}
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
          <TouchableOpacity style={[styles.protocol,{right: scaleSize(10)}]} onPress={this.Privacy}>
            <Text style={styles.footerItem}>
              {getLanguage(this.props.language).Profile.PRIVACY_POLICY}
              {/* 隐私政策 */}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.informationView, informationBottom]}>
          <Text style={styles.information}>
            Copyright 2018-2020 SuperMap Software Co.,Ltd.All rights reserved
          </Text>
        </View>
      </Container>
    )
  }
}
