/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, Platform, BackHandler } from 'react-native'
import { Container, SearchBar } from '../../../../components'
import NavigationService from '../../../NavigationService'
import { Toast, LayerUtil } from '../../../../utils'
import { ConstInfo, MAP_MODULE } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import { LayerAttributeTable } from '../../components'
import styles from './styles'
// import { SMap } from 'imobile_for_reactnative'
import { language,getLanguage } from '../../../../language/index'

const PAGE_SIZE = 30

export default class LayerAttributeSearch extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    selection: Object,
    map: Object,
    // attributes: Object,
    // setAttributes: () => {},
    setCurrentAttribute: () => {},
    // getAttributes: () => {},
    setLayerAttributes: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.layerPath = params && params.layerPath
    this.isSelection = (params && params.isSelection) || false
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      showTable: false,
      startIndex: 0,
    }

    // this.currentFieldInfo = []
    this.currentFieldIndex = -1
    this.currentPage = 0
    this.total = -1
    this.isInit = true
    this.noMore = false
  }

  componentDidMount() {
    this.searchBar && this.searchBar.focus()
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
    // this.props.setCurrentAttribute({})
  }

  back = () => {
    NavigationService.goBack()
    return true
  }

  /** 下拉刷新 **/
  // refresh = (cb = () => {}) => {
  //   this.currentPage = 0
  //   this.getAttribute(cb)
  // }

  /** 加载更多 **/
  loadMore = (cb = () => {}) => {
    if (this.searchKey === '' || this.searchKey === undefined || this.isInit) {
      this.isInit = false
      return
    }
    if (this.noMore) {
      cb && cb()
      return
    }
    this.currentPage += 1
    this.search(this.searchKey, 'loadMore', attribute => {
      cb && cb()
      if (!attribute || attribute.length <= 0) {
        Toast.show(ConstInfo.ALL_DATA_ALREADY_LOADED)
        // this.currentPage--
      } else if (attribute.length < PAGE_SIZE) {
        this.noMore = true
      }
    })
  }

  search = (searchKey = '', type = 'reset', cb = () => {}) => {
    if (!this.layerPath || searchKey === '') return
    this.searchKey = searchKey
    let result = {},
      attributes = []
    ;(async function() {
      try {
        if (this.isSelection) {
          result = await LayerUtil.searchSelectionAttribute(
            this.state.attributes,
            this.layerPath,
            searchKey,
            this.currentPage,
            PAGE_SIZE,
            type,
          )
        } else {
          result = await LayerUtil.searchLayerAttribute(
            this.state.attributes,
            this.layerPath,
            {
              key: searchKey,
            },
            this.currentPage,
            PAGE_SIZE,
            type,
          )
        }

        attributes = result.attributes || []

        if (
          Math.floor(this.total / PAGE_SIZE) === this.currentPage ||
          attributes.data.length < PAGE_SIZE
        ) {
          this.noMore = true
        }

        if (attributes.data.length === 1) {
          this.setState({
            showTable: true,
            attributes,
            startIndex: -1,
          })
        } else {
          this.setState({
            showTable: true,
            attributes,
          })
        }
        this.isInit = false
        this.setLoading(false)
        cb && cb(attributes)
      } catch (e) {
        this.setLoading(false)
        cb && cb(attributes)
      }
    }.bind(this)())
  }

  selectRow = ({ data, index }) => {
    if (!data || index < 0) return
    if (this.currentFieldIndex !== index) {
      this.setState({
        currentFieldInfo: data,
      })

      this.currentFieldIndex = index
    } else {
      this.setState({
        currentFieldInfo: [],
      })

      this.currentFieldIndex = -1
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  /** 修改表格中的值的回调 **/
  changeAction = data => {
    if (
      this.props.setLayerAttributes &&
      typeof this.props.setLayerAttributes === 'function'
    ) {
      // 单个对象属性和多个对象属性数据有区别
      let isSingleData = typeof data.cellData !== 'object'
      this.props.setLayerAttributes([
        {
          mapName: this.props.map.currentMap.name,
          layerPath: this.layerPath,
          fieldInfo: [
            {
              name: isSingleData ? data.rowData.name : data.cellData.name,
              value: data.value,
            },
          ],
          params: {
            // index: int,      // 当前对象所在记录集中的位置
            filter: `SmID=${
              isSingleData
                ? this.state.attributes.data[0][0].value
                : data.rowData[0].value
            }`, // 过滤条件
            cursorType: 2, // 2: DYNAMIC, 3: STATIC
          },
        },
      ])
    }
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={2}
        type={this.type}
      />
    )
  }

  renderMapLayerAttribute = () => {
    if (
      !this.state.attributes ||
      (!this.state.attributes.data && this.state.attributes.data.length === 0)
    )
      return null
    return (
      <LayerAttributeTable
        ref={ref => (this.table = ref)}
        data={
          this.state.attributes.data.length > 1
            ? this.state.attributes.data
            : this.state.attributes.data[0]
        }
        tableHead={
          this.state.attributes.data.length > 1
            ? this.state.attributes.head
            : [
              getLanguage(global.language).Map_Lable.NAME, 
              getLanguage(global.language).Map_Lable.ATTRIBUTE
              //'名称'
              //'属性值'
            ]
        }
        widthArr={this.state.attributes.data.length === 1 && [100, 100]}
        type={
          this.state.attributes.data.length > 1
            ? LayerAttributeTable.Type.MULTI_DATA
            : LayerAttributeTable.Type.SINGLE_DATA
        }
        // indexColumn={this.state.attributes.data.length > 1 ? 0 : -1}
        indexColumn={0}
        startIndex={
          this.state.attributes.data.length === 1
            ? -1
            : this.state.startIndex + 1
        }
        hasInputText={this.state.attributes.data.length > 1}
        selectRow={this.selectRow}
        // refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
        changeAction={this.changeAction}
      />
    )
  }

  renderSearchBar = () => {
    return (
      <SearchBar
        ref={ref => (this.searchBar = ref)}
        onSubmitEditing={searchKey => {
          this.setLoading(true, ConstInfo.SEARCHING)
          this.search(searchKey)
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS }
        //{'请输入搜索关键字'}
      />
    )
  }

  render() {
    let title = ''
    switch (GLOBAL.Type) {
      case constants.COLLECTION:
        title = MAP_MODULE.MAP_COLLECTION
        break
      case constants.MAP_EDIT:
        title = MAP_MODULE.MAP_EDIT
        break
      case constants.MAP_3D:
        title = MAP_MODULE.MAP_3D
        break
      case constants.MAP_THEME:
        title = MAP_MODULE.MAP_THEME
        break
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: title,
          navigation: this.props.navigation,
          headerCenter: this.renderSearchBar(),
          // headerRight: [
          //   <MTBtn
          //     key={'upload'}
          //     image={require('../../../../assets/header/Frenchgrey/icon_search.png')}
          //     imageStyle={styles.upload}
          //     onPress={this.upload}
          //   />,
          // ],
        }}
        style={styles.container}
      >
        {this.state.showTable &&
        this.state.attributes &&
        this.state.attributes.head ? (
            this.state.attributes.head.length > 0 ? (
              this.renderMapLayerAttribute()
            ) : (
              <View style={styles.infoView}>
                <Text style={styles.info}>
                {/* 搜索结果 */}
                </Text>
              </View>
            )
          ) : (
            <View style={styles.infoView}>
              <Text style={styles.info}>
              {/* 搜索结果 */}
              </Text>
            </View>
          )}
      </Container>
    )
  }
}
