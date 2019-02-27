import React, { Component } from 'react'
import { View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native'
import { SScene } from 'imobile_for_reactnative'
import styles from './styles'
import { Toast } from '../../../../utils'
export default class PointSearch extends Component {
  props: {
    type: String,
  }

  constructor(props) {
    super(props)
    this.type = props.type
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
  }

  toLocationPoint = async (pointName, index) => {
    try {
      if (this.PointType) {
        if (this.PointType === 'firstPoint') {
          await SScene.savePoint(index, this.PointType)
          this.setState({ firstPoint: pointName, analystData: [] })
        } else {
          await SScene.savePoint(index, this.PointType)
          await SScene.navigationLine()
          this.setState({ secondPoint: pointName, analystData: [] })
        }
      } else {
        await SScene.toLocationPoint(index)
        this.setState({ searchValue: pointName, searchData: [] })
      }
    } catch (error) {
      Toast.show('网络错误')
    }
  }

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

  setSearchData = result => {
    if (this.PointType) {
      this.setState({ analystData: result })
    } else {
      this.setState({ searchData: result })
    }
  }

  renderPointSearch = () => {
    return (
      <View style={styles.PointSearch}>
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
        {this.state.searchData.length > 0 ? (
          <FlatList
            style={styles.PointSearchList}
            data={this.state.searchData}
            renderItem={this.renderItem}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }

  renderPointAnalyst = () => {
    return (
      <View style={styles.PointAnalyst}>
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
          style={styles.SearchInput}
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
          style={styles.SearchInput}
        />
        {this.state.analystData.length > 0 ? (
          <FlatList
            style={styles.PointAnalystList}
            data={this.state.analystData}
            renderItem={this.renderItem}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.contain}>
        {this.props.type === 'pointAnalyst'
          ? this.renderPointSearch()
          : this.renderPointAnalyst()}
      </View>
    )
  }
}
