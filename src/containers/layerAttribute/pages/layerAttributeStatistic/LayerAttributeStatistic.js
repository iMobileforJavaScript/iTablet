/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container, TextBtn } from '../../../../components'
import { getLanguage } from '../../../../language'
import { Toast, LayerUtils } from '../../../../utils'
import { SMap, StatisticMode } from 'imobile_for_reactnative'
import styles from './styles'

function getData(language) {
  let data = [
    {
      key: 'SUM',
      value: StatisticMode.SUM,
      title: getLanguage(language).Map_Attribute.SUM,
    },
    {
      key: 'AVERAGE',
      value: StatisticMode.AVERAGE,
      title: getLanguage(language).Map_Attribute.AVERAGE,
    },
    {
      key: 'MAX',
      value: StatisticMode.MAX,
      title: getLanguage(language).Map_Attribute.MAX,
    },
    {
      key: 'MIN',
      value: StatisticMode.MIN,
      title: getLanguage(language).Map_Attribute.MIN,
    },
    {
      key: 'VARIANCE',
      value: StatisticMode.VARIANCE,
      title: getLanguage(language).Map_Attribute.VARIANCE,
    },
    {
      key: 'STANDARD_DEVIATION',
      value: StatisticMode.STDDEVIATION,
      title: getLanguage(language).Map_Attribute.STANDARD_DEVIATION,
    },
    {
      key: 'COUNT_UNIQUE',
      // value: StatisticMode.SUM,
      title: getLanguage(language).Map_Attribute.COUNT_UNIQUE,
    },
  ]
  return data
}

export default class LayerAttributeStatistic extends React.Component {
  props: {
    navigation: Object,
    language: string,
    currentAttribute: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.fieldInfo = params.fieldInfo
    this.layer = params.layer
    const data = getData(this.props.language)
    this.state = {
      data,
      currentMethod: data[0],
      result: '0.0',
    }
  }

  componentDidMount() {
    this.statistic(this.state.currentMethod)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        data: getData(this.props.language),
      })
    }
  }

  statistic = item => {
    if (item.key === 'COUNT_UNIQUE') {
      SMap.getLayerAttribute(this.layer.path, 0, 100000000000, {
        groupBy: this.fieldInfo.name,
      }).then(
        result => {
          this.setState({
            currentMethod: item,
            result: result.total.toString(),
          })
        },
        () => {
          this.setState({
            currentMethod: item,
          })
          Toast.show(
            getLanguage(this.props.language).Prompt.NOT_SUPPORT_STATISTIC,
          )
        },
      )
    } else {
      SMap.statistic(
        this.layer.path,
        false,
        this.fieldInfo.name,
        item.value,
      ).then(
        result => {
          this.setState({
            currentMethod: item,
            result: result.toString(),
          })
        },
        () => {
          this.setState({
            currentMethod: item,
            result: '0.0',
          })
          Toast.show(
            getLanguage(this.props.language).Prompt.NOT_SUPPORT_STATISTIC,
          )
        },
      )
    }
  }

  complete = () => {
    NavigationService.goBack()
  }

  _keyExtractor = item => item.key

  _renderItem = ({ item }) => {
    let viewStyle, textStyle
    if (item.key === this.state.currentMethod.key) {
      viewStyle = styles.headerSelectedItem
      textStyle = styles.headerSelectedItemText
    } else {
      viewStyle = styles.headerItem
      textStyle = styles.headerItemText
    }
    return (
      <View style={styles.methodItem}>
        <TouchableOpacity
          style={viewStyle}
          onPress={() => this.statistic(item)}
        >
          <Text style={textStyle}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSeparator = () => {
    return <View style={styles.headerSeparator} />
  }

  _renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <FlatList
          ref={ref => (this.listView = ref)}
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderSeparator}
          getItemLayout={this.getItemLayout}
          horizontal={true}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
          extraData={this.state.currentMethod}
        />
      </View>
    )
  }

  _renderContent = () => {
    return (
      <View style={styles.contentView}>
        <View style={styles.contentTop}>
          <Text style={styles.contentTitle}>{this.fieldInfo.name || ''}</Text>
          <Text style={styles.method}>{this.state.currentMethod.title}</Text>
          <Text style={styles.contentValue}>{this.state.result}</Text>
        </View>
        <View style={styles.contentBottom}>
          <View style={styles.contentBottomTextRow}>
            <View style={styles.contentBottomTextTitleView}>
              <Text style={styles.contentBottomText}>
                {getLanguage(this.props.language).Map_Attribute.FIELD_TYPE}
              </Text>
            </View>
            <View style={styles.contentBottomTextValueView}>
              <Text style={styles.contentBottomText}>
                {LayerUtils.getFieldTypeText(
                  this.fieldInfo.type,
                  this.props.language,
                )}
              </Text>
            </View>
          </View>
          <View style={styles.contentBottomTextRow}>
            <View style={styles.contentBottomTextTitleView}>
              <Text style={styles.contentBottomText}>
                {getLanguage(this.props.language).Map_Attribute.ALIAS}
              </Text>
            </View>
            <View style={styles.contentBottomTextValueView}>
              <Text style={styles.contentBottomText}>
                {this.fieldInfo.caption || ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Attribute
            .ATTRIBUTE_STATISTIC,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Prompt.COMPLETE}
              textStyle={styles.headerBtnTitle}
              btnClick={this.complete}
            />
          ),
        }}
      >
        {this._renderHeader()}
        {this._renderContent()}
      </Container>
    )
  }
}
