/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import Container from '../../../components/Container'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native'
import RenderFindItem from './RenderFindItem'
import { Toast } from '../../../utils/index'
import styles from './Styles'
import color from '../../../styles/color'
import FetchUtils from '../../../utils/FetchUtils'
export default class Find extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: [{}],
      isRefresh: false,
      progressWidth: this.screenWidth * 0.6,
      isLoadingData: false,
    }
    this.loadCount = 1
    this.flatListData = []
    this.allUserDataCount = -1
    this.currentLoadDataCount = 0
  }
  componentDidMount() {
    this._loadFirstUserData()
  }
  componentWillUnmount() {
    this._clearInterval()
  }
  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: this.screenWidth })
    }
  }
  _loadFirstUserData = async () => {
    try {
      this._showLoadProgressView()
      await this._loadUserData(1)
    } finally {
      this._clearInterval()
    }
  }
  _showLoadProgressView = () => {
    this.objProgressWidth = setInterval(() => {
      let prevProgressWidth = this.state.progressWidth
      let currentPorWidth
      if (prevProgressWidth >= this.screenWidth - 250) {
        currentPorWidth = prevProgressWidth + 1
        if (currentPorWidth >= this.screenWidth - 50) {
          currentPorWidth = this.screenWidth - 50
          return
        }
      } else {
        currentPorWidth = prevProgressWidth * 1.01
      }
      this.setState({ progressWidth: currentPorWidth })
    }, 100)
  }
  _loadUserData = async currentPage => {
    let arrObjContent = []
    try {
      let objUserData = await this.getAllUserZipData(currentPage)
      this.currentLoadDataCount = currentPage * 9
      this.allUserDataCount = objUserData.total
      let objArrUserDataContent = objUserData.content
      let contentLength = objArrUserDataContent.length
      for (let i = 0; i < contentLength; i++) {
        let objContent = objArrUserDataContent[i]
        if (objContent.type === 'WORKSPACE') {
          arrObjContent.push(objContent)
        }
      }
      if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
        this.flatListData = this.flatListData.concat(arrObjContent)
        this.setState({ data: this.flatListData })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ data: arrObjContent })
    }
    return arrObjContent
  }

  getAllUserZipData = currentPage => {
    let time = new Date().getTime()
    let uri = `https://www.supermapol.com/web/datas.json?currentPage=${currentPage}&tags=%5B%22%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&t=${time}`
    return FetchUtils.getObjJson(uri)
  }

  _onRefresh = async () => {
    try {
      if (!this.state.isRefresh) {
        this.loadCount = 1
        this.setState({ isRefresh: true })
        this.flatListData = await this._loadUserData(1, 20)
        this.setState({ isRefresh: false, data: this.flatListData })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isRefresh: false })
    }
  }
  _loadData = async () => {
    try {
      if (!this.state.isLoadingData) {
        this.setState({ data: this.flatListData, isLoadingData: true })
        this.loadCount = this.loadCount + 1
        let arrData = await this._loadUserData(this.loadCount)
        this.flatListData = this.flatListData.concat(arrData)
        this.setState({ data: this.flatListData, isLoadingData: false })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isLoadingData: false })
    }
  }

  _footView() {
    if (
      this.allUserDataCount >= this.state.data.length &&
      this.allUserDataCount > this.currentLoadDataCount
    ) {
      return (
        <View
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            style={{
              flex: 1,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            color={'orange'}
            animating={true}
          />
          <Text
            style={{
              flex: 1,
              lineHeight: 20,
              fontSize: 12,
              textAlign: 'center',
              color: 'orange',
            }}
          >
            加载中...
          </Text>
        </View>
      )
    } else {
      return (
        <View>
          <Text
            style={{
              flex: 1,
              lineHeight: 30,
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            -----这是底线-----
          </Text>
        </View>
      )
    }
  }

  _keyExtractor = (item, index) => {
    if (item.id !== undefined) {
      return item.id + '' + index * index
    }
    return index * index
  }

  _selectRender = () => {
    if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
      return (
        <View
          style={[
            styles.noDataViewStyle,
            { backgroundColor: color.contentColorWhite },
          ]}
        >
          <View
            style={{
              height: 2,
              width: this.state.progressWidth,
              backgroundColor: '#1c84c0',
            }}
          />
        </View>
      )
    }

    return (
      <FlatList
        style={[
          styles.haveDataViewStyle,
          { backgroundColor: color.contentColorWhite },
        ]}
        data={this.state.data}
        renderItem={data => {
          return <RenderFindItem user={this.props.user} data={data.item} />
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this._onRefresh}
            colors={['orange', 'red']}
            tintColor={'orange'}
            titleColor={'orange'}
            title={'刷新中...'}
            enabled={true}
          />
        }
        keyExtractor={this._keyExtractor}
        onEndReachedThreshold={0.1}
        onEndReached={this._loadData}
        ListFooterComponent={this._footView()}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '发现',
          withoutBack: true,
          navigation: this.props.navigation,
        }}
      >
        {this._selectRender()}
      </Container>
    )
  }
}
