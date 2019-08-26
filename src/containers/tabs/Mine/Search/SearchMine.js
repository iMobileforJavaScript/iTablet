import React, { Component } from 'react'
import { View, Text, FlatList } from 'react-native'
import { Container } from '../../../../components'
import { SMap } from 'imobile_for_reactnative'
import { FileTools, NativeMethod } from '../../../../native'
import { getLanguage } from '../../../../language'
import UserType from '../../../../constants/UserType'
import { ConstPath } from '../../../../constants'
import SearchItem from './SearchItem'
import NavigationService from '../../../NavigationService'
const pointImg = require('../../../../assets/mapToolbar/dataset_type_point_black.png')
const lineImg = require('../../../../assets/mapToolbar/dataset_type_line_black.png')
const regionImg = require('../../../../assets/mapToolbar/dataset_type_region_black.png')
const DataImg = require('../../../../assets/Mine/mine_my_online_data_black.png')
const MapImg = require('../../../../assets/mapToolbar/list_type_map_black.png')
const SceneImg = require('../../../../assets/mapTools/icon_scene.png')

class SearchMine extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.searchText = params.searchText
    this.state = {
      resultList: [],
    }
  }

  componentDidMount() {
    this._search()
  }

  _search = async () => {
    this.userPath = await FileTools.appendingHomeDirectory(
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? ConstPath.CustomerPath
        : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
    )
    await this._searchMyData('DATA')
    await this._searchMyData('MAP')
    await this._searchMyData('SCENE')
    await this._searchMyData('SYMBOL')
    await this._searchMyData('COLOR')
    await this._searchLabel()
    await this._searchTemplate()
  }

  _searchMyData = async type => {
    let title = type
    let data = await this._getMydata(type)
    let dataLength = data.length
    if (dataLength === 0) {
      return
    }
    let labelUDBName = 'Label_' + this.props.user.currentUser.userName + '#'
    let result = []
    for (let i = 0; i < dataLength; i++) {
      let fileName = data[i].name
      let name =
        fileName.lastIndexOf('.') > 0
          ? fileName.substring(0, fileName.lastIndexOf('.'))
          : fileName
      if (name === labelUDBName) {
        continue
      }
      if (name.indexOf(this.searchText) > -1) {
        result.push({
          title: title,
          data: data[i],
        })
      }
    }
    this.setState({ resultList: this.state.resultList.concat(result) })
  }

  _searchLabel = async () => {
    let title = 'LABEL'
    let data = await this._getLabel()
    let dataLength = data.length
    if (dataLength === 0) {
      return
    }
    let result = []
    for (let i = 0; i < dataLength; i++) {
      let name = data[i].title
      if (name.indexOf(this.searchText) > -1) {
        result.push({
          title: title,
          data: data[i],
        })
      }
    }
    this.setState({ resultList: this.state.resultList.concat(result) })
  }

  _searchTemplate = async () => {
    let title = 'TEMPLATE'
    let data = await this._getTemplate()
    let dataLength = data.length
    if (dataLength === 0) {
      return
    }
    let result = []
    for (let i = 0; i < dataLength; i++) {
      let name = data[i].name
      if (name.indexOf(this.searchText) > -1) {
        result.push({
          title: title,
          data: data[i],
        })
      }
    }
    this.setState({ resultList: this.state.resultList.concat(result) })
  }

  _getMydata = async type => {
    let path, filter
    switch (type) {
      case 'DATA':
        path = this.userPath + ConstPath.RelativePath.Datasource
        filter = {
          extension: 'udb',
          type: 'file',
        }
        break
      case 'MAP':
        path = this.userPath + ConstPath.RelativePath.Map
        filter = {
          extension: 'xml',
          type: 'file',
        }
        break
      case 'SCENE':
        path = this.userPath + ConstPath.RelativePath.Scene
        filter = {
          type: 'Directory',
        }
        break
      case 'SYMBOL':
        path = this.userPath + ConstPath.RelativePath.Symbol
        filter = {
          type: 'file',
        }
        break
      case 'COLOR':
        path = this.userPath + ConstPath.RelativePath.Color
        filter = {
          extension: 'scs',
          type: 'file',
        }
        break
    }
    let data = await FileTools.getPathListByFilter(path, filter)
    return data
  }

  _getLabel = async () => {
    let path =
      this.userPath +
      ConstPath.RelativePath.Datasource +
      'Label_' +
      this.props.user.currentUser.userName +
      '#.udb'
    let result = await FileTools.fileIsExist(path)
    if (!result) {
      return []
    }
    return await SMap.getUDBNameOfLabel(path)
  }

  _getTemplate = async () => {
    let userName = this.props.user.currentUser.userName
    let plottingData = await this._getPlotDataList(userName)
    let collectionData = await NativeMethod.getTemplates(
      userName,
      ConstPath.Module.Collection,
    )
    let data = []
    if (plottingData.length > 0) {
      data = data.concat(plottingData)
    }
    if (collectionData.length > 0) {
      data = data.concat(collectionData)
    }
    return data
  }

  async _getPlotDataList(userName) {
    let path =
      ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.Plotting
    let plotPath = await FileTools.appendingHomeDirectory(path)
    let list = []
    let arrDirContent = await FileTools.getDirectoryContent(plotPath)
    if (arrDirContent.length > 0) {
      for (let key in arrDirContent) {
        if (arrDirContent[key].type === 'directory') {
          let dirPath = plotPath + arrDirContent[key].name
          let dirContent = await FileTools.getDirectoryContent(dirPath)
          let hasSymbol, hasSymbolIcon
          if (dirContent.length === 0) continue
          for (let index in dirContent) {
            if (dirContent[index].type === 'directory') {
              if (dirContent[index].name === 'Symbol') {
                hasSymbol = true
              } else if (dirContent[index].name === 'SymbolIcon') {
                hasSymbolIcon = true
              }
            }
          }
          if (hasSymbol && hasSymbolIcon) {
            list.push({
              name: arrDirContent[key].name,
              path: plotPath + arrDirContent[key].name,
            })
          }
        }
      }
    }
    return list
  }

  goToData = item => {
    if (item.title) {
      switch (item.title) {
        case 'DATA':
          NavigationService.navigate('MyData', {
            title: getLanguage(global.language).Profile.DATA,
          })
          break
        case 'MAP':
          NavigationService.navigate('MyData', {
            title: getLanguage(global.language).Profile.MAP,
          })
          break
        case 'SCENE':
          NavigationService.navigate('MyData', {
            title: getLanguage(global.language).Profile.SCENE,
          })
          break
        case 'SYMBOL':
          NavigationService.navigate('MyData', {
            title: getLanguage(global.language).Profile.SYMBOL,
          })
          break
        case 'COLOR':
          NavigationService.navigate('MyData', {
            title: getLanguage(global.language).Profile.COLOR_SCHEME,
          })
          break
        case 'LABEL':
          NavigationService.navigate('MyLabel', {
            title: getLanguage(global.language).Profile.MARK,
          })
          break
        case 'TEMPLATE':
          NavigationService.navigate('MyModule', {
            title: getLanguage(global.language).Profile.TEMPLATE,
          })
          break
      }
    }
  }

  renderItem = ({ item }) => {
    let fileName = item.data.name
    let text
    let fileType
    let img = null
    if (fileName !== undefined) {
      text =
        fileName.lastIndexOf('.') > 0
          ? fileName.substring(0, fileName.lastIndexOf('.'))
          : fileName
      fileType =
        fileName.lastIndexOf('.') > 0
          ? fileName.substring(fileName.lastIndexOf('.') + 1)
          : ''
    }
    if (item.title === 'DATA') {
      img = DataImg
    } else if (item.title === 'MAP') {
      img = MapImg
    } else if (item.title === 'SCENE') {
      img = SceneImg
    } else if (item.title === 'SYMBOL') {
      if (fileType === 'sym') {
        img = pointImg
      } else if (fileType === 'lsl') {
        img = lineImg
      } else if (fileType === 'bru') {
        img = regionImg
      } else {
        img = DataImg
      }
    } else if (item.title === 'LABEL') {
      img = DataImg
      text = item.data.title
    } else if (item.title === 'TEMPLATE') {
      img = MapImg
    } else {
      img = DataImg
    }
    return (
      <SearchItem
        item={item}
        image={img}
        text={text}
        searchText={this.searchText}
        onPress={() => this.goToData(item)}
      />
    )
  }

  renderNoData = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>{getLanguage(global.language).Profile.NO_SEARCH_RESULT}</Text>
      </View>
    )
  }

  renderResult = () => {
    return (
      <FlatList
        ref={ref => (this.ref = ref)}
        renderItem={this.renderItem}
        data={this.state.resultList}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={this.renderNoData}
      />
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.SEARCH,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this.renderResult()}
      </Container>
    )
  }
}

export default SearchMine
