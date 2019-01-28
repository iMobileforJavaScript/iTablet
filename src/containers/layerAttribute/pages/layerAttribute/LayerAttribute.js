/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, Dimensions, Platform, BackHandler } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container } from '../../../../components'
import { Toast } from '../../../../utils'
import { ConstInfo, MAP_MODULE } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import { LayerAttributeTable } from '../../components'
import styles from './styles'
import { SScene } from 'imobile_for_reactnative'
const SINGLE_ATTRIBUTE = 'singleAttribute'
export default class LayerAttribute extends React.Component {
  props: {
    nav: Object,
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    selection: Object,
    attributes: Object,
    setAttributes: () => {},
    setCurrentAttribute: () => {},
    getAttributes: () => {},
    closeMap: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.state = {
      attribute: {},
      showTable: false,
    }

    this.currentFieldInfo = []
    this.currentFieldIndex = -1
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    if (this.type === 'MAP_3D') {
      this.getMap3DAttribute()
    } else {
      this.getAttribute()
    }
  }

  componentDidUpdate(prevProps) {
    let mapTabs = this.props.nav.routes[this.props.nav.index]
    if (
      JSON.stringify(prevProps.currentLayer) !==
        JSON.stringify(this.props.currentLayer) ||
      (mapTabs.routes[mapTabs.index].key === 'LayerAttribute' &&
        JSON.stringify(this.props.nav) !== JSON.stringify(prevProps.nav))
    ) {
      this.getAttribute()
    }
    // else if (
    //   JSON.stringify(prevProps.currentAttribute) !==
    //   JSON.stringify(this.props.currentAttribute)
    // ) {
    //   this.setState({
    //     attribute: this.props.currentAttribute,
    //   })
    // }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    }
    this.props.setCurrentAttribute({})
  }

  getMap3DAttribute = async () => {
    let data = await SScene.getLableAttributeList()
    let list = []
    for (let index = 0; index < data.length; index++) {
      let item = [
        {
          fieldInfo: { caption: 'id' },
          name: 'id',
          value: data[index].id,
        },
        {
          fieldInfo: { caption: 'name' },
          name: 'name',
          value: data[index].name,
        },
        {
          fieldInfo: { caption: 'description' },
          name: 'description',
          value: data[index].description,
        },
      ]
      list.push(item)
    }
    this.props.setAttributes(list)
    !this.state.showTable &&
      this.setState({
        showTable: true,
      })
  }

  getAttribute = (cb = () => {}) => {
    if (!this.props.currentLayer.path) return
    this.setLoading(true, ConstInfo.LOADING_DATA)
    ;(async function() {
      try {
        this.props.getAttributes(this.props.currentLayer.path)
        !this.state.showTable &&
          this.setState({
            showTable: true,
          })
        this.setLoading(false)
        cb && cb()
      } catch (e) {
        this.setLoading(false)
        cb && cb()
      }
    }.bind(this)())
  }

  add = () => {
    Toast.show('待做')
  }

  edit = () => {
    if (this.currentFieldInfo.length > 0) {
      let smID = -1
      for (let i = 0; i < this.currentFieldInfo.length; i++) {
        if (this.currentFieldInfo[i].name === 'SMID') {
          smID = this.currentFieldInfo[i].value
          break
        }
      }
      smID >= 0 &&
        NavigationService.navigate('LayerAttributeObj', {
          dataset: this.state.dataset,
          filter: 'SmID=' + smID,
          index: this.currentFieldIndex,
          callBack: this.getDatasets,
        })
    } else {
      Toast.show('请选择一个属性')
    }
  }

  selectRow = (data, index) => {
    if (!data || index < 0) return
    this.currentFieldInfo = data
    this.currentFieldIndex = index
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  back = () => {
    this.props.navigation.navigate('MapView')
    // if (GLOBAL.Type === ConstToolType.MAP_3D) {
    //   NavigationService.goBack()
    // } else {
    //   this.backAction = async () => {
    //     try {
    //       this.setLoading(true, '正在关闭地图')
    //       await this.props.closeMap()
    //       GLOBAL.clearMapData()
    //       this.setLoading(false)
    //       NavigationService.goBack()
    //     } catch (e) {
    //       this.setLoading(false)
    //     }
    //   }
    //   SMap.mapIsModified().then(async result => {
    //     if (result) {
    //       this.setSaveViewVisible(true)
    //     } else {
    //       await this.backAction()
    //       this.backAction = null
    //     }
    //   })
    // }
    return true
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
    // console.log(this.props.attributes.data)
    if (!this.props.attributes || !this.props.attributes.data) return null
    if (this.props.attributes.data.length > 1) {
      return (
        <LayerAttributeTable
          ref={ref => (this.table = ref)}
          data={this.props.attributes.data}
          tableHead={this.props.attributes.head}
          // data={this.state.attribute}
          // tableHead={this.state.tableHead}
          // tableTitle={this.state.tableTitle}
          // NormalrowStyle={{width:scaleSize(720)}}
          type={
            this.props.attributes.data.length > 1
              ? LayerAttributeTable.Type.EDIT_ATTRIBUTE
              : LayerAttributeTable.Type.ATTRIBUTE
          }
          selectRow={this.selectRow}
          refresh={this.getAttribute}
        />
      )
    } else {
      return (
        <LayerAttributeTable
          ref={ref => (this.table = ref)}
          data={this.props.attributes.data[0]}
          hasIndex={false}
          tableTitle={this.props.attributes.head}
          // colHeight={this.state.colHeight}
          widthArr={[100, 100]}
          tableHead={['名称', '属性值']}
          // tableHead={this.state.tableHead}
          refresh={this.getAttribute}
        />
      )
    }
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
          // backAction: this.back,
          // backImg: require('../../../../assets/mapTools/icon_close.png'),
          withoutBack: true,
        }}
        bottomBar={this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
        style={styles.container}
      >
        {this.state.showTable ? (
          this.props.attributes.head.length > 0 ? (
            this.type === 'MAP_3D' ? (
              <LayerAttributeTable
                ref={ref => (this.table = ref)}
                data={this.props.attributes.data}
                tableHead={this.props.attributes.head}
                // data={this.state.attribute}
                // tableHead={this.state.tableHead}
                // tableTitle={this.state.tableTitle}
                refresh={this.getMap3DAttribute}
                NormalrowStyle={{ width: Dimensions.get('window').width }}
                type={LayerAttributeTable.Type.MAP3D_ATTRIBUTE}
                selectRow={this.selectRow}
              />
            ) : (
              this.renderMapLayerAttribute()
            )
          ) : (
            <View style={styles.infoView}>
              <Text style={styles.info}>当前图层属性不可见</Text>
            </View>
          )
        ) : (
          <View style={styles.infoView}>
            <Text style={styles.info}>请选择图层</Text>
          </View>
        )}
      </Container>
    )
  }
}
