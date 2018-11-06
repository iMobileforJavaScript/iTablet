/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native'
import { Container, ListSeparator } from '../../../components'
import NavigationService from '../../NavigationService'
import { DatasetType } from 'imobile_for_reactnative'

import styles from './styles'

export default class ChooseDatasource extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.data = {
      datasource: {
        title: '选择数据源',
        data: (params && params.data) || [],
      },
      dataset: {
        title: '选择数据集类型',
        data: [
          {
            key: '点',
            value: DatasetType.POINT,
            image: require('../../../assets/map/icon-dot.png'),
            imageSize: 'small',
          },
          {
            key: '线',
            value: DatasetType.LINE,
            image: require('../../../assets/map/icon-line.png'),
          },
          {
            key: '面',
            value: DatasetType.REGION,
            image: require('../../../assets/map/icon-polygon.png'),
          },
          {
            key: 'CAD',
            value: DatasetType.CAD,
            image: require('../../../assets/map/icon-cad.png'),
          },
          {
            key: '文本',
            value: DatasetType.TEXT,
            image: require('../../../assets/map/icon-text.png'),
          },
        ],
      },
    }
    this.workspace = params && params.workspace
    this.map = params && params.map
    this.cb = params && params.cb
    this.state = {
      title: this.data.datasource.title,
      listData: this.data.datasource.data,
      currentDatasource: {},
    }
  }

  rowAction = item => {
    if (item.image) {
      // 选择dataset的类型
      NavigationService.navigate('NewDSet', {
        workspace: this.workspace,
        map: this.map,
        cb: this.cb,
        type: item.value,
        datasource: this.state.currentDatasource.datasource,
      })
    } else {
      // 选择数据源
      this.setState({
        currentDatasource: item,
        listData: this.data.dataset.data,
        title: this.data.dataset.title,
      })
    }
  }

  back = () => {
    if (this.state.currentDatasource.key) {
      // 此时已选择了数据源，正在选择数据集类型
      this.setState({
        currentDatasource: {},
        listData: this.data.datasource.data,
        title: this.data.datasource.title,
      })
    } else {
      NavigationService.goBack()
    }
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.row}
        onPress={() => this.rowAction(item)}
      >
        {item.image && (
          <View style={styles.imageView}>
            <Image
              style={
                item.imageSize === 'small' ? styles.imageSmall : styles.image
              }
              source={item.image}
            />
          </View>
        )}
        <Text style={styles.rowTitle}>{item.key}</Text>
      </TouchableOpacity>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  _keyExtractor = (item, index) => index

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        <FlatList
          data={this.state.listData}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    )
  }
}
