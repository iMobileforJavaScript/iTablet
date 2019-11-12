/*
 Copyright © SuperMap. All rights reserved.
 Author: yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { TextInput } from 'react-native'
import { BtnTwo, Container } from '../../../components'
import { constUtil, Toast, scaleSize } from '../../../utils'
import { DatasetVectorInfo } from 'imobile_for_reactnative'
import NavigationService from '../../NavigationService'

import styles from './styles'

export default class NewDSet extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.datasource = params && params.datasource
    this.type = params && params.type
    this.workspace = params && params.workspace
    this.map = params && params.map
    this.cb = params && params.cb
    this.state = {
      name: '',
    }
  }

  createDataset = () => {
    if (!this.state.name) {
      Toast.show('请输入数据集名称')
      return
    }
    (async function() {
      try {
        let dtname = await this.datasource.getAvailableDatasetName(
          this.state.name,
        )
        let datasetVectorInfo = await new DatasetVectorInfo().createObjByNameType(
          dtname,
          this.type,
        )
        let datasetVector = await this.datasource.createDatasetVector(
          datasetVectorInfo,
        )
        if (datasetVector) {
          Toast.show('创建数据集成功')
          this.cb && this.cb()
          NavigationService.goBack(
            this.props.nav.routes[this.props.nav.routes.length - 2].key,
          )
        } else {
          Toast.show('创建数据集失败')
        }
      } catch (e) {
        Toast.show('创建数据集失败')
      }
    }.bind(this)())
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '新建数据集',
          navigation: this.props.navigation,
        }}
      >
        <TextInput
          accessible={true}
          accessibilityLabel={'请输入数据集名称'}
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="请输入数据集名称"
          placeholderTextColor={constUtil.USUAL_SEPARATORCOLOR}
          value={this.state.name}
          onChangeText={text => {
            this.setState({ name: text })
          }}
        />
        <BtnTwo
          style={{ marginTop: scaleSize(80) }}
          text="确定"
          btnClick={this.createDataset}
        />
      </Container>
    )
  }
}
