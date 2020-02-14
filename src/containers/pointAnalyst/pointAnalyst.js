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
import { scaleSize, setSpText, Toast } from '../../utils'
import styles from './styles'
import { getLanguage } from '../../language/index'
import constants from '../workspace/constants'
import PropTypes from 'prop-types'
import PoiData from './PoiData'
import color from '../../styles/color'
import { TouchType } from '../../constants'
// import { color } from '../../styles';
export default class PointAnalyst extends Component {
  props: {
    navigation: Object,
    mapSearchHistory: Array,
    setMapSearchHistory: () => {},
  }

  static propTypes = {
    mapNavigation: PropTypes.object,
    navigationChangeAR: PropTypes.bool,
    setMapNavigation: PropTypes.func,
    setNavigationChangeAR: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params.type
    this.searchClickedInfo = params.searchClickedInfo || {}
    this.changeNavPathInfo = params.changeNavPathInfo || {}
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
    //默认搜索半径5km 结果不足十条范围扩大十倍
    this.radius = 5000
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

  onListItemPress = async (item, index) => {
    if (this.searchClickedInfo.isClicked) {
      let title = this.searchClickedInfo.title
      if (
        title === getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT
      ) {
        //设置起点
        GLOBAL.STARTX = item.x
        GLOBAL.STARTY = item.y
        GLOBAL.STARTNAME = item.pointName
        await SMap.getStartPoint(GLOBAL.STARTX, GLOBAL.STARTY, false)
        if (GLOBAL.ENDX && GLOBAL.ENDY) {
          await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, false)
        }
      } else {
        //设置终点
        GLOBAL.ENDX = item.x
        GLOBAL.ENDY = item.y
        GLOBAL.ENDNAME = item.pointName
        await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, false)
        if (GLOBAL.STARTX && GLOBAL.STARTY) {
          await SMap.getStartPoint(GLOBAL.STARTX, GLOBAL.STARTY, false)
        }
      }
      NavigationService.navigate('NavigationView', {
        changeNavPathInfo: this.changeNavPathInfo,
        getNavigationDatas: this.getNavigationDatas,
      })
      this.setState({
        searchValue: null,
        searchData: [],
        analystData: [],
        firstPoint: null,
        secondPoint: null,
        showList: true,
      })
    } else {
      let historyArr = this.props.mapSearchHistory
      let hasAdded = false
      historyArr.map(v => {
        if (v.pointName === item.pointName) hasAdded = true
      })
      if (!hasAdded) {
        historyArr.push({
          x: item.x,
          y: item.y,
          pointName: item.pointName,
          address: item.address,
        })
      }
      this.props.setMapSearchHistory(historyArr)
      this.toLocationPoint({ item, pointName: item.pointName, index })
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.onListItemPress(item, index)
          }}
        >
          <Image
            style={styles.pointImg}
            source={require('../../assets/mapToolbar/icon_scene_position.png')}
          />
          {item.pointName && (
            <Text style={styles.itemText}>{item.pointName}</Text>
          )}
          {item.distance && (
            <Text style={styles.distance}>{item.distance}</Text>
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
          let result = await SScene.toLocationPoint(item)
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
          getLanguage(global.language).Prompt.SEARCHING,
        )
        let x = item.x
        let y = item.y
        let address = item.address
        this.setState({ searchValue: pointName, searchData: [] })
        if (GLOBAL.Type === constants.MAP_NAVIGATION) {
          await SMap.clearTrackingLayer()
          this.props.setMapNavigation({
            isShow: true,
            name: pointName,
          })
        }
        let result = await SMap.toLocationPoint(item)
        if (result) {
          GLOBAL.PoiTopSearchBar.setVisible(true)
          GLOBAL.PoiTopSearchBar.setState({ defaultValue: item.pointName })
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
                GLOBAL.PoiInfoContainer.setVisible(true, this.radius)
                this.container.setLoading(false)
                NavigationService.goBack()
              },
            )
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
          <FlatList
            data={this.state.searchData}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => (item.pointName + index).toString()}
          />
        </View>
      </View>
    )
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  getDistance = (p1, p2) => {
    //经纬度差值转距离 单位 m
    let R = 6371393
    return Math.abs(
      ((p2.x - p1.x) *
        Math.PI *
        R *
        Math.cos((((p2.y + p1.y) / 2) * Math.PI) / 180)) /
        180,
    )
  }

  //属性排序
  compare = prop => (a, b) => {
    return a[prop] - b[prop]
  }

  getSearchResult = params => {
    let searchStr = ''
    let keys = Object.keys(params)
    keys.map(key => {
      searchStr += `&${key}=${params[key]}`
    })
    let url = `http://www.supermapol.com/iserver/services/localsearch/rest/searchdatas/China/poiinfos.json?&key=tY5A7zRBvPY0fTHDmKkDjjlr${searchStr}`
    //console.warn(url)
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          Toast.show(getLanguage(global.language).Prompt.NO_SEARCH_RESULTS)
        } else {
          let poiInfos = data.poiInfos
          if (poiInfos.length < 10) {
            this.radius = 50000
            fetch(url.replace('radius=5000', 'radius=50000'))
              .then(response => response.json())
              .then(data2 => {
                poiInfos = data2.poiInfos
                let searchData = poiInfos.map(item => {
                  return {
                    pointName: item.name,
                    x: item.location.x,
                    y: item.location.y,
                    address: item.address,
                    distance: this.getDistance(item.location, this.location),
                  }
                })
                searchData
                  .sort(this.compare('distance'))
                  .forEach((item, index) => {
                    searchData[index].distance =
                      item.distance > 1000
                        ? (item.distance / 1000).toFixed(2) + 'km'
                        : ~~item.distance + 'm'
                  })
                this.setState({
                  searchData,
                  poiInfos,
                  showList: false,
                })
              })
          } else {
            let searchData = poiInfos.map(item => {
              return {
                pointName: item.name,
                x: item.location.x,
                y: item.location.y,
                address: item.address,
                distance: this.getDistance(item.location, this.location),
              }
            })
            searchData.sort(this.compare('distance')).forEach((item, index) => {
              searchData[index].distance =
                item.distance > 1000
                  ? (item.distance / 1000).toFixed(2) + 'km'
                  : ~~item.distance + 'm'
            })
            this.setState({
              searchData,
              poiInfos,
              showList: false,
            })
          }
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
        onSubmitEditing={async searchKey => {
          // this.setLoading(true, getLanguage(global.language).Prompt.SERCHING)
          let location
          if (this.is3D) {
            location = await SScene.getSceneCenter()
          } else {
            location = await SMap.getMapcenterPosition()
          }
          this.location = location
          this.getSearchResult({ keyWords: searchKey })
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
        //{'请输入搜索关键字'}
      />
    )
  }

  renderIconItem = () => {
    let data = PoiData()
    return (
      <View
        style={{
          width: '100%',
        }}
      >
        <FlatList
          style={styles.wrapper}
          renderItem={this.renderIcons}
          data={data}
          keyExtractor={(item, index) => item.title + index}
          numColumns={4}
        />
        {this.props.mapSearchHistory.length > 0 && (
          <FlatList
            style={{
              maxHeight: scaleSize(400),
            }}
            renderItem={this.renderItem}
            data={this.props.mapSearchHistory}
            keyExtractor={(item, index) => item.pointName + index}
            numColumns={1}
          />
        )}
        {this.props.mapSearchHistory.length > 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: color.background,
              width: '100%',
              height: scaleSize(70),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.props.setMapSearchHistory &&
                this.props.setMapSearchHistory([])
            }}
          >
            <Text
              style={{
                fontSize: setSpText(20),
              }}
            >
              {getLanguage(global.language).Prompt.CLEAR_HISTORY}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
  renderIcons = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          if (!this.is3D) {
            let location = await SMap.getMapcenterPosition()
            this.location = location
            if (GLOBAL.PoiInfoContainer) {
              GLOBAL.PoiInfoContainer.setState({
                showList: true,
                location: this.location,
              })
              GLOBAL.PoiInfoContainer.getSearchResult(
                {
                  keyWords: item.title,
                  location: JSON.stringify(location),
                  radius: this.radius,
                },
                () => {
                  GLOBAL.PoiInfoContainer.setVisible(true)
                  GLOBAL.PoiTopSearchBar.setVisible(true)
                  GLOBAL.PoiTopSearchBar.setState({ defaultValue: item.title })
                  NavigationService.navigate('MapView')
                },
              )

              GLOBAL.PoiTopSearchBar.setVisible(true)
              GLOBAL.PoiTopSearchBar.setState({ defaultValue: item.title })

              if (GLOBAL.Type === constants.MAP_NAVIGATION) {
                GLOBAL.TouchType = TouchType.NORMAL
                await SMap.clearTrackingLayer()
                // this.props.setNavigationChangeAR(true)
                this.props.setMapNavigation({
                  isShow: true,
                  name: item.title,
                })
              }
            }
          } else {
            let location = await SScene.getSceneCenter()
            this.location = location
            this.getSearchResult({
              keyWords: item.title,
              location: JSON.stringify(location),
              radius: this.radius,
            })
          }
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
          // navigation: this.props.navigation,
          backAction: () => {
            // if (this.searchClickedInfo.isClicked) {
            //   GLOBAL.LocationView && GLOBAL.LocationView.setVisible(true, true)
            // }
            this.props.navigation.goBack()
            GLOBAL.PoiTopSearchBar && GLOBAL.PoiTopSearchBar.setVisible(false)
          },
          headerCenter:
            this.type === 'pointSearch' ? this.renderSearchBar() : <View />,
        }}
      >
        {this.type === 'pointSearch' &&
          this.state.showList &&
          this.renderIconItem()}
        {this.type === 'pointSearch'
          ? this.renderPointSearch()
          : this.renderPointAnalyst()}
      </Container>
    )
  }
}
