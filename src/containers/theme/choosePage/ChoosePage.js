/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { TouchableOpacity, FlatList, Text } from 'react-native'
import { Container, ListSeparator } from '../../../components'
import { ColorGradientType } from 'imobile_for_reactnative'
import NavigationService from '../../NavigationService'
import { getLanguage } from '../../../language/index'
import styles from './styles'

const fonts = [
  { key: '宋体' },
  { key: '幼圆' },
  { key: '黑体' },
  { key: '华文新魏' },
  { key: '微软雅黑' },
]
const fontColors = [
  { key: '#FF0000' },
  { key: '#00FF00' },
  { key: '#0000FF' },
  { key: '#fa575c' },
  { key: '#4BA0FF' },
]

export default class ChoosePage extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.type = (params && params.type) || 'font'
    this.title = ''
    let data = []
    // this.title = this.type === 'font' ? '字体' : this.type === 'color' ? '颜色' : '表达式'
    this.cb = (params && params.cb) || (() => {})
    this.layer = params && params.layer
    // let data = this.type === 'font' ? fonts : this.type === 'color' ? this.getColors() : []

    switch (this.type) {
      case 'font':
        this.title = getLanguage(global.language).Map_Main_Menu.THEME_FONT
        //'字体'
        data = fonts
        break
      case 'color':
        this.title = getLanguage(global.language).Map_Main_Menu.THEME_COLOR
        //'颜色'
        data = this.getColors()
        break
      case 'expression':
        this.title = getLanguage(global.language).Map_Main_Menu.THEME_EXPRESSION
        //'表达式'
        data = []
        break
      case 'fontColor':
        this.title = getLanguage(global.language).Map_Main_Menu.THEME_FONT
        //'文本颜色'
        data = fontColors
        break
    }

    this.state = {
      type: params && params.type,
      data: data,
    }
  }

  componentDidMount() {
    if (this.type === 'expression') {
      this.getData()
    }
  }

  getColors = () => {
    let color = []
    for (let key in ColorGradientType) {
      color.push({
        key: key,
        value: ColorGradientType[key],
      })
    }
    return color
  }

  getData = () => {
    if (!this.layer) return
    this.container.setLoading(true)
    ;(async function() {
      try {
        let dataset = await this.layer.getDataset()
        let datasetVector = await dataset.toDatasetVector()
        let fieldInfos = await datasetVector.getFieldInfos()

        let data = []
        fieldInfos.forEach(obj => {
          data.push({
            key: obj.name,
            data: obj,
          })
        })
        // Object.keys(fieldInfos).map(key => {
        //   data.push({
        //     key: key,
        //     data: fieldInfos[key],
        //   })
        // })
        this.setState({
          data: data,
        })
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  rowAction = row => {
    this.cb && this.cb(row)
    NavigationService.goBack()
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.key}
        activeOpacity={0.8}
        style={styles.row}
        onPress={() => this.rowAction(item)}
      >
        <Text style={styles.rowTitle}>{item.key}</Text>
      </TouchableOpacity>
    )
  }

  _renderSeparator = ({ leadingItem }) => {
    return <ListSeparator key={'separator_' + leadingItem.id} />
  }

  _keyExtractor = (item, index) => index

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderSeparator}
        />
      </Container>
    )
  }
}

ChoosePage.Type = {
  FONT: 'font',
  EXPRESSION: 'expression',
  COLOR: 'color',
  FONT_COLOR: 'fontColor',
}
