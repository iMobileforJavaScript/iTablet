import React from 'react'
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { getPublicAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import DropdownView from './DropdownView'
import styles from './styles'
import { Toast } from '../../../../utils'

export default class SearchMenu extends React.Component {
  props: {
    onPress: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.getData(),
      selectList: [],
      visible: false,
    }
    this.searchText = ''
  }

  getData = () => [
    {
      key: getLanguage(global.language).Find.ALL,
      value: 'all',
    },
    {
      key: getLanguage(global.language).Find.ONLINE_WORKSPACE,
      value: ['WORKSPACE'],
    },
    {
      key: getLanguage(global.language).Find.ONLINE_DATASOURCE,
      value: ['UDB'],
    },
    {
      key: getLanguage(global.language).Find.ONLINE_SYMBOL,
      value: ['MARKERSYMBOL', 'LINESYMBOL', 'FILLSYMBOL'],
    },
    {
      key: getLanguage(global.language).Find.ONLINE_COLORSCHEME,
      value: ['COLORSCHEME'],
    },
  ]

  getValueByKey = key => {
    let data = this.getData()
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return data[i].value
      }
    }
  }

  setVisible = visible => {
    if (this.state.visible !== visible) {
      this.setState({ visible: visible })
    }
    if (!visible) {
      this.reset()
    }
  }

  renderItemAllSelect = item => {
    let allData = this.getData()
    let isAllSelected = this.state.selectList.length === allData.length - 1
    let img = isAllSelected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.MenuItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            if (isAllSelected) {
              this.setState({ selectList: [] })
            } else {
              let selectList = []
              for (let i = 1; i < allData.length; i++) {
                selectList.push(allData[i].key)
              }
              this.setState({ selectList: selectList })
            }
          }}
        >
          <Image source={img} style={styles.MenuImageStyle} />
          <Text style={styles.textStyle}>{item.key}</Text>
        </TouchableOpacity>
        <View style={styles.menuSeperator} />
      </View>
    )
  }

  renderItem = ({ index, item }) => {
    if (item.value === 'all') {
      return this.renderItemAllSelect(item)
    }
    let indexInList = this.state.selectList.indexOf(item.key)
    let img =
      indexInList !== -1
        ? getPublicAssets().common.icon_check
        : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.MenuItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            let selectList = this.state.selectList.clone()
            if (indexInList === -1) {
              selectList.push(item.key)
            } else {
              selectList.splice(indexInList, 1)
            }
            this.setState({ selectList: selectList })
          }}
        >
          <Image source={img} style={styles.MenuImageStyle} />
          <Text style={styles.textStyle}>{item.key}</Text>
        </TouchableOpacity>
        {this.state.data.length !== index + 1 && (
          <View style={styles.menuSeperator} />
        )}
      </View>
    )
  }

  renderSearchBar = () => {
    return (
      <View style={styles.searchViewStyle}>
        <View style={styles.searchBarStyle}>
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
            onSubmitEditing={this.search}
            onChangeText={value => {
              this.searchText = value
            }}
          />
        </View>
      </View>
    )
  }

  reset = () => {
    this.searchText = ''
    this.searchBar && this.searchBar.clear()
    this.setState({ selectList: [] })
  }

  search = () => {
    if (this.searchText === '') {
      Toast.show(getLanguage(global.language).Prompt.ENTER_KEY_WORDS)
      return
    }
    if (this.state.selectList.length === 0) {
      Toast.show(getLanguage(global.language).Find.SELECT_DATATYPES_FIRST)
      return
    }
    let selectList = this.state.selectList
    let selectTypes = []
    for (let i = 0; i < selectList.length; i++) {
      selectTypes = selectTypes.concat(this.getValueByKey(selectList[i]))
    }

    this.props.onPress({
      keywords: this.searchText,
      selectTypes: selectTypes,
    })
  }

  renderButtons = () => {
    return (
      <View style={styles.searchButtonContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={this.reset}>
          <Text style={styles.searchButtonText}>
            {getLanguage(global.language).Find.RESET}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={this.search}>
          <Text style={styles.searchButtonText}>
            {getLanguage(global.language).Find.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderList = () => {
    return (
      <View style={styles.SearchMenuContainer}>
        {this.renderSearchBar()}
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.selectList}
        />
        {this.renderButtons()}
      </View>
    )
  }

  render() {
    return (
      <DropdownView
        visible={this.state.visible}
        onBackgroudPress={() => {
          this.setVisible(false)
        }}
      >
        {this.renderList()}
      </DropdownView>
    )
  }
}
