import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { AnalystItem } from '../../components'
import { CheckStatus } from '../../../../constants'

import styles from './styles'

export default class SingleBufferAnalystView extends Component {
  props: {
    navigation: Object,
    data: Array,
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: 'Taiwan',
      dataSet: 'Taiwan',
      // 缓冲类型
      roundTypeStatus: CheckStatus.CHECKED,
      flatTypeStatus: CheckStatus.UN_CHECK,
      flatType: '左缓冲',
      // 缓冲半径
      bufferRadio: 10,
      // 结果设置
      isUnionBuffer: false,
      isRetainAttribute: true,
      isShowOnMap: true,
      isShowOnScene: false,
      semicircleArcNum: 100,
      // 结果数据
      resultDataSource: 'Taiwan',
      resultDataSet: 'Taiwan',
    }
  }

  changeBufferType = title => {
    let roundTypeStatus
    let flatTypeStatus
    switch (title) {
      case '圆头缓冲':
        roundTypeStatus = CheckStatus.CHECKED
        flatTypeStatus = CheckStatus.UN_CHECK
        break
      case '平头缓冲':
        roundTypeStatus = CheckStatus.UN_CHECK
        flatTypeStatus = CheckStatus.CHECKED
        break
    }
    this.setState({
      roundTypeStatus,
      flatTypeStatus,
    })
  }

  renderTop = () => {
    return (
      <View key="topView" style={styles.topView}>
        <AnalystItem title={'数据源'} value={this.state.dataSource} />
        <AnalystItem title={'数据集'} value={this.state.dataSet} />
        {/*<View>*/}
        {/*<TouchableOpacity*/}
        {/*</View>*/}
      </View>
    )
  }

  renderType = () => {
    return (
      <View key="typeView" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>缓冲类型</Text>
        </View>
        <AnalystItem
          radioStatus={this.state.roundTypeStatus}
          title={'圆头缓冲'}
          onRadioPress={() => this.changeBufferType('圆头缓冲')}
        />
        <AnalystItem
          radioStatus={this.state.flatTypeStatus}
          title={'平头缓冲'}
          value={this.state.flatType}
          onRadioPress={() => this.changeBufferType('平头缓冲')}
        />
      </View>
    )
  }

  renderBufferRadio = () => {
    return (
      <View key="optionView" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>缓冲半径</Text>
        </View>
        <AnalystItem title={'缓冲半径'} value={this.state.bufferRadio + '米'} />
      </View>
    )
  }

  renderResultSetting = () => {
    return (
      <View key="resultSetting" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>结果设置</Text>
        </View>
        <AnalystItem
          title={'合并缓冲区'}
          value={this.state.isUnionBuffer}
          onChange={value => {
            this.setState({
              isUnionBuffer: value,
            })
          }}
        />
        <AnalystItem
          title={'保留原对象字段属性'}
          value={this.state.isRetainAttribute}
          onChange={value => {
            this.setState({
              isRetainAttribute: value,
            })
          }}
        />
        <AnalystItem
          title={'在地图中展示'}
          value={this.state.isShowOnMap}
          onChange={value => {
            this.setState({
              isShowOnMap: value,
            })
          }}
        />
        <AnalystItem
          title={'在场景中展示'}
          value={this.state.isShowOnScene}
          onChange={value => {
            this.setState({
              isShowOnScene: value,
            })
          }}
        />
        <AnalystItem
          title={'半圆弧线段数'}
          value={this.state.semicircleArcNum}
        />
      </View>
    )
  }

  renderResultData = () => {
    return (
      <View key="resultData" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>结果数据</Text>
        </View>
        <AnalystItem title={'数据源'} value={this.state.resultDataSource} />
        <AnalystItem title={'数据集'} value={this.state.resultDataSet} />
      </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderTop()}
        {this.renderType()}
        {this.renderBufferRadio()}
        {this.renderResultSetting()}
        {this.renderResultData()}
      </ScrollView>
    )
  }
}
