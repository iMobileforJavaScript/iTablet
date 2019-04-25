import React, { Component } from 'react'
import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native'
import { Container, SearchBar } from '../../components'
// import { scaleSize} from '../../utils'
// import { ConstInfo } from '../../constants'
import { SScene } from 'imobile_for_reactnative'
import NavigationService from '../NavigationService'
import { Toast } from '../../utils'
import styles from './styles'
import { getLanguage } from '../../language/index'
// import { color } from '../../styles';
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
          this.setLoading(false)
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

  _keyExtractor = (item, index) => index

  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.toLocationPoint(item.pointName, index)
          }}
        >
          <Image
            style={styles.pointImg}
            source={require('../../assets/mapToolbar/icon_scene_position.png')}
          />
          {item.pointName && (
            <Text style={styles.itemText}>{item.pointName}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.itemSeparator} />
      </View>
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
          this.container.setLoading(
            true,
            getLanguage(global.language).Prompt.ANALYSING,
          )
          //'路径分析中')
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
        this.container.setLoading(
          true,
          getLanguage(global.language).Prompt.SERCHING,
        )
        // '位置搜索中')
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
      Toast.show('网络错误')
    }
  }

  renderPointAnalyst = () => {
    return (
      <View>
        <View style={styles.pointAnalystView}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                resizeMode={'contain'}
                source={require('../../assets/mapToolbar/icon_scene_tool_start.png')}
                style={styles.startPoint}
              />
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
                style={styles.onInput}
                placeholder={
                  getLanguage(global.language).Prompt.CHOOSE_STARTING_POINT
                }
                //{'请输入起点'}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                resizeMode={'contain'}
                source={require('../../assets/mapToolbar/icon_scene_tool_end.png')}
                style={styles.endPoint}
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
                style={styles.secondInput}
                placeholder={
                  getLanguage(global.language).Prompt.CHOOSE_DESTINATION
                }
                // {'请输入终点'}
              />
            </View>
          </View>
          <Image
            resizeMode={'contain'}
            source={require('../../assets/mapToolbar/icon_scene_pointAnalyst.png')}
            style={styles.analyst}
          />
        </View>
        <View>
          <FlatList
            data={this.state.analystData}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    )
  }

  renderPointSearch = () => {
    return (
      <View>
        {/* <View style={styles.pointSearchView}>
          <TextInput
            placeholder={'请输入需要搜索的位置'}
            style={styles.PointSearch}
            onChangeText={text => {
              if (text === null || text === '') {
                this.setState({ searchValue: text, searchData: [] })
                return
              }
              SScene.pointSearch(text)
              this.setState({ searchValue: text })
            }}
            value={this.state.searchValue}
          />
          <Image
            resizeMode={'contain'}
            source={require('../../assets/mapToolbar/icon_search_black.png')}
            style={styles.search}
          />
        </View> */}
        <View>
          <FlatList data={this.state.searchData} renderItem={this.renderItem} />
        </View>
      </View>
    )
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  renderSearchBar = () => {
    return (
      <SearchBar
        ref={ref => (this.searchBar = ref)}
        onSubmitEditing={searchKey => {
          // this.setLoading(true, getLanguage(global.language).Prompt.SERCHING)
          SScene.pointSearch(searchKey).then(() => {
            // this.setLoading(false)
          })
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
        //{'请输入搜索关键字'}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        initWithLoading={false}
        headerProps={{
          title: this.type === 'pointSearch' ? '位置搜索' : '路径分析',
          navigation: this.props.navigation,
          headerCenter:
            this.type === 'pointSearch' ? this.renderSearchBar() : <View />,
        }}
      >
        {this.type === 'pointSearch'
          ? this.renderPointSearch()
          : this.renderPointAnalyst()}
      </Container>
    )
  }
}
