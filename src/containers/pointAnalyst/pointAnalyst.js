import React, { Component } from 'react'
import { Text, FlatList, TouchableOpacity, View, TextInput } from 'react-native'
import { Container } from '../../components'
// import { scaleSize} from '../../utils'
import { SScene } from 'imobile_for_reactnative'
import NavigationService from '../NavigationService'
import { Toast } from '../../utils'
import styles from './styles'
export default class PointAnalyst extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params.type
    this.PointType = null
    this.state = {
      searchValue: null,
      searchData: [],
      analystData: [],
      firstPoint: null,
      secondPoint: null,
    }
  }

  componentDidMount() {
    SScene.initPointSearch()
    SScene.setPointSearchListener({
      callback: result => {
        if (this.type === 'pointAnalyst') {
          this.setState({ analystData: result })
        } else {
          this.setState({ searchData: result })
        }
      },
    })
  }

  renderHeaderOfAnalyst = () => {
    return (
      <View>
        <TextInput
          onChangeText={text => {
            if (text === null || text === '') {
              this.setState({ firstPoint: text, analystData: [] })
              return
            }
            SScene.pointSearch(text)
            this.PointType = 'firstPoint'
            this.setState({ firstPoint: text })
          }}
          value={this.state.firstPoint}
          style={styles.analystInput}
        />
        <TextInput
          onChangeText={text => {
            if (text === null || text === '') {
              this.setState({ secondPoint: text, analystData: [] })
              return
            }
            SScene.pointSearch(text)
            this.PointType = 'secondPoint'
            this.setState({ secondPoint: text })
          }}
          value={this.state.secondPoint}
          style={styles.analystInput}
        />
      </View>
    )
  }

  renderHeaderOfSearch = () => {
    return (
      <View>
        <TextInput
          onChangeText={text => {
            if (text === null || text === '') {
              this.setState({ searchValue: text, searchData: [] })
              return
            }
            SScene.pointSearch(text)
            this.setState({ searchValue: text })
          }}
          value={this.state.searchValue}
          style={styles.SearchInput}
        />
      </View>
    )
  }

  _keyExtractor = (item, index) => index

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.itemView}
        onPress={() => {
          this.toLocationPoint(item.pointName, index)
        }}
      >
        <Text style={styles.itemText}>{item.pointName}</Text>
      </TouchableOpacity>
    )
  }

  toLocationPoint = async (pointName, index) => {
    try {
      if (this.PointType) {
        if (this.PointType === 'firstPoint') {
          await SScene.savePoint(index, this.PointType)
          this.setState({ firstPoint: pointName, analystData: [] })
        } else {
          await SScene.savePoint(index, this.PointType)
          this.container.setLoading(true, '路径分析中')
          this.setState({ secondPoint: pointName, analystData: [] })
          let result = await SScene.navigationLine()
          if (result) {
            this.container.setLoading(false)
            NavigationService.goBack()
          } else {
            Toast.show('网络错误')
          }
        }
      } else {
        this.container.setLoading(true, '位置搜索中')
        this.setState({ searchValue: pointName, searchData: [] })
        let result = await SScene.toLocationPoint(index)
        if (result) {
          this.container.setLoading(false)
          NavigationService.goBack()
        } else {
          Toast.show('网络错误')
        }
      }
    } catch (error) {
      Toast.show(error)
    }
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        initWithLoading={false}
        headerProps={{
          title: '三维场景',
          navigation: this.props.navigation,
          headerCenter:
            this.type === 'pointSearch'
              ? this.renderHeaderOfSearch()
              : this.renderHeaderOfAnalyst(),
          headerStyle: this.type === 'pointSearch' ? {} : { height: 120 },
        }}
      >
        {this.state.analystData.length > 0 ? (
          <FlatList
            style={styles.PointAnalystList}
            data={this.state.analystData}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
          />
        ) : (
          <View />
        )}
        {this.state.searchData.length > 0 ? (
          <FlatList
            style={styles.PointAnalystList}
            data={this.state.searchData}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
          />
        ) : (
          <View />
        )}
      </Container>
    )
  }
}
