import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Container } from '../../../../components'
import { SMap } from 'imobile_for_reactnative'
import { FileTools, NativeMethod } from '../../../../native'
import { getLanguage } from '../../../../language'
import UserType from '../../../../constants/UserType'
import { ConstPath } from '../../../../constants'
import SearchItem from './SearchItem'
import NavigationService from '../../../NavigationService'
import { getPublicAssets } from '../../../../assets'
import { scaleSize, Toast } from '../../../../utils'
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
    this.searchText = params ? params.searchText || '' : ''
    this.state = {
      searching: false,
      resultList: [],
    }
  }

  componentDidMount() {
    // this._search()
  }

  _search = async () => {
    if (this.searchText === '') {
      Toast.show(getLanguage(global.language).Prompt.ENTER_KEY_WORDS)
      return
    }
    this.setState({ searching: true, resultList: [] })
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
    this.setState({ searching: false })
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
      if (this.searchText !== '' && name.indexOf(this.searchText) > -1) {
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
      let name = data[i].name
      if (this.searchText !== '' && name.indexOf(this.searchText) > -1) {
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
      if (this.searchText !== '' && name.indexOf(this.searchText) > -1) {
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
          NavigationService.navigate('MyDatasource', {
            title: getLanguage(global.language).Profile.DATA,
          })
          break
        case 'MAP':
          NavigationService.navigate('MyMap', {
            title: getLanguage(global.language).Profile.MAP,
          })
          break
        case 'SCENE':
          NavigationService.navigate('MyScene', {
            title: getLanguage(global.language).Profile.SCENE,
          })
          break
        case 'SYMBOL':
          NavigationService.navigate('MySymbol', {
            title: getLanguage(global.language).Profile.SYMBOL,
          })
          break
        case 'COLOR':
          NavigationService.navigate('MyColor', {
            title: getLanguage(global.language).Profile.COLOR_SCHEME,
          })
          break
        case 'LABEL':
          NavigationService.navigate('MyLabel', {
            title: getLanguage(global.language).Profile.MARK,
          })
          break
        case 'TEMPLATE':
          NavigationService.navigate('MyTemplate', {
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
    let text
    if (this.searchText === '') {
      text = getLanguage(global.language).Prompt.ENTER_KEY_WORDS
    } else if (this.state.searching) {
      text = getLanguage(global.language).Prompt.SERCHING
    } else {
      text = getLanguage(global.language).Profile.NO_SEARCH_RESULT
    }
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: scaleSize(20) }}>{text}</Text>
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
        searching={this.state.searching}
      />
    )
  }

  renderHeaderCenter = () => {
    return (
      <View style={styles.searchViewStyle}>
        <Image
          style={styles.searchImgStyle}
          source={getPublicAssets().common.icon_search_a0}
        />
        <TextInput
          ref={ref => (this.searchBar = ref)}
          style={styles.searchInputStyle}
          placeholder={getLanguage(global.language).Profile.SEARCH}
          placeholderTextColor={'#A7A7A7'}
          returnKeyType={'search'}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={true}
          onSubmitEditing={this._search}
          onChangeText={value => {
            this.searchText = value
          }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.searchText = ''
            this.searchBar.clear()
          }}
        >
          <Image
            style={styles.clearImg}
            resizeMode={'contain'}
            source={require('../../../../assets/public/icon_input_clear.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          withoutBack: false,
          navigation: this.props.navigation,
          headerCenter: this.renderHeaderCenter(),
        }}
      >
        {this.renderResult()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  searchViewStyle: {
    width: scaleSize(460),
    height: scaleSize(48),
    backgroundColor: '#505050',
    borderRadius: scaleSize(24),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchImgStyle: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  searchInputStyle: {
    width: scaleSize(360),
    paddingVertical: 0,
    fontSize: scaleSize(20),
    color: '#A7A7A7',
  },
  clearImg: {
    width: scaleSize(20),
    height: scaleSize(20),
  },
})

export default SearchMine
