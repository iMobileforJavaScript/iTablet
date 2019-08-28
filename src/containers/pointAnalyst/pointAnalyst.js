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
import { SScene, SMap } from 'imobile_for_reactnative'
import NavigationService from '../NavigationService'
import { Toast } from '../../utils'
import styles from './styles'
import { getLanguage } from '../../language/index'
import constants from '../workspace/constants'
import PropTypes from 'prop-types'
import PoiData from './PoiData'
// import { color } from '../../styles';
export default class PointAnalyst extends Component {
  props: {
    navigation: Object,
  }

  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params.type
    this.is3D = GLOBAL.Type === constants.MAP_3D
    this.PointType = null
    this.state = {
      searchValue: null,
      searchData: [],
      analystData: [],
      firstPoint: null,
      secondPoint: null,
      showList: true,
    }
  }

  componentDidMount() {
    if (this.is3D) {
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
            this.toLocationPoint({ item, pointName: item.pointName, index })
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

  toLocationPoint = async ({ item, pointName, index }) => {
    try {
      if (this.is3D) {
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
              Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
              //'网络错误')
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
            Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
            //'网络错误')
          }
        }
      } else {
        let x = item.x
        let y = item.y
        let address = item.address
        this.setState({ searchValue: pointName, searchData: [] })
        if (GLOBAL.Type === constants.MAP_NAVIGATION) {
          await SMap.openTrafficMap()
          await SMap.routeAnalyst(x, y)
          this.props.setMapNavigation({
            isShow: true,
            name: pointName,
            isPointShow: true,
          })
        }
        let result = await SMap.toLocationPoint(item)
        if (result) {
          this.container.setLoading(false)
          GLOBAL.Type !== constants.MAP_NAVIGATION &&
            GLOBAL.PoiInfoContainer &&
            GLOBAL.PoiInfoContainer.setState(
              {
                destination: this.state.searchValue,
                location: { x, y },
                address,
                showList: false,
                neighbor: [],
                resultList: [],
              },
              () => {
                GLOBAL.PoiInfoContainer.setVisible(true)
              },
            )
          NavigationService.goBack()
        } else {
          Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
        }
      }
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
      //'网络错误')
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

  getSearchResult = params => {
    let searchStr = ''
    let keys = Object.keys(params)
    keys.map(key => {
      searchStr += `&${key}=${params[key]}`
    })
    // location={"x":104.04801859009979,"y":30.64623399251152}&radius=5000keyWords=${key}
    let url = `http://www.supermapol.com/iserver/services/localsearch/rest/searchdatas/China/poiinfos.json?&key=tY5A7zRBvPY0fTHDmKkDjjlr${searchStr}`
    //console.warn(url)
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          Toast.show(getLanguage(global.language).Prompt.NO_SEARCH_RESULTS)
        } else {
          let poiInfos = data.poiInfos
          let searchData = poiInfos.map(item => {
            return {
              pointName: item.name,
              x: item.location.x,
              y: item.location.y,
              address: item.address,
            }
          })
          this.setState({
            searchData,
            poiInfos,
            showList: false,
          })
        }
      })
  }
  renderSearchBar = () => {
    return (
      <SearchBar
        ref={ref => (this.searchBar = ref)}
        onClear={() => {
          if (!this.is3D && this.type === 'pointSearch') {
            this.setState({
              showList: true,
              searchData: [],
            })
          }
        }}
        onSubmitEditing={searchKey => {
          // this.setLoading(true, getLanguage(global.language).Prompt.SERCHING)
          if (this.is3D) {
            SScene.pointSearch(searchKey).then(() => {
              // this.setLoading(false)
            })
          } else {
            this.getSearchResult({ keyWords: searchKey })
          }
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
        //{'请输入搜索关键字'}
      />
    )
  }

  renderIconItem = () => {
    let data = PoiData()
    return (
      <FlatList
        style={styles.wrapper}
        renderItem={this.renderIcons}
        data={data}
        keyExtractor={(item, index) => item.title + index}
        numColumns={4}
      />
    )
  }
  renderIcons = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          let location = await SMap.getMapcenterPosition()
          this.getSearchResult({
            keyWords: item.title,
            location: JSON.stringify(location),
            radius: 5000,
          })
        }}
        style={styles.searchIconWrap}
      >
        <Image
          style={styles.searchIcon}
          source={item.icon}
          resizeMode={'contain'}
        />
        <Text style={styles.iconTxt}>{item.title}</Text>
      </TouchableOpacity>
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
        {this.type === 'pointSearch' &&
          !this.is3D &&
          this.state.showList &&
          this.renderIconItem()}
        {this.type === 'pointSearch'
          ? this.renderPointSearch()
          : this.renderPointAnalyst()}
      </Container>
    )
  }
}
