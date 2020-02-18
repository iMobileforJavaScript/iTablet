import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { ListSeparator } from '../../../../components'
import constants from '../../constants'
import PropTypes from 'prop-types'
import NavigationService from '../../../../containers/NavigationService'
import MT_Btn from '../../../../components/mapTools/MT_Btn'
import { getLanguage } from '../../../../language/index'
import { getThemeAssets } from '../../../../assets'
// import { SScene, Utility } from 'imobile_for_reactnative'
// export const MAP_LOCAL = 'MAP_LOCAL'
// export const MAP_3D = 'MAP_3D'

export default class MapToolbar extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    type: PropTypes.string,
    navigation: PropTypes.object,
    initIndex: PropTypes.number,
    POP_List: PropTypes.func,
    layerManager: PropTypes.func,
    style: PropTypes.any,
    appConfig: PropTypes.object,
  }

  static defaultProps = {
    type: constants.MAP_COLLECTION,
    hidden: false,
    editLayer: {},
    initIndex: -1,
  }

  constructor(props) {
    super(props)

    this.show = false
    this.type = ''
    const data = this.getToolbar(props.type)

    let current = 0
    if (props.initIndex < 0 && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === props.navigation.state.key) {
          current = i
        }
      }
    } else {
      current = props.initIndex
    }

    this.state = {
      data: data,
      currentIndex: current,
    }
  }

  getToolbar = type => {
    let list = []
    const tabModules = this.props.appConfig.mapModules[
      this.props.appConfig.currentMapModule
    ].tabModules
    for (let i = 0; i < tabModules.length; i++) {
      switch (tabModules[i]) {
        case 'Map':
          list.push({
            key: 'MapView',
            title:
              type === constants.MAP_AR
                ? getLanguage(global.language).Map_Label.ARMAP
                : getLanguage(global.language).Map_Label.MAP,
            //'地图',
            image: getThemeAssets().tabBar.tab_map,
            selectedImage: getThemeAssets().tabBar.tab_map_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('MapView', { type })
            },
          })
          break
        case 'Layer':
          list.push({
            key: 'LayerManager',
            title: getLanguage(global.language).Map_Label.LAYER,
            //'图层',
            image: getThemeAssets().tabBar.tab_layer,
            selectedImage: getThemeAssets().tabBar.tab_layer_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerManager', { type })
            },
          })
          break
        case 'Attribute':
          list.push({
            key: 'LayerAttribute',
            title: getLanguage(global.language).Map_Label.ATTRIBUTE,
            //'属性',
            image: getThemeAssets().tabBar.tab_attribute,
            selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAttribute', { type })
            },
          })
          break
        case 'Settings':
          list.push({
            key: 'MapSetting',
            title: getLanguage(global.language).Map_Label.SETTING,
            //'设置',
            image: getThemeAssets().tabBar.tab_setting,
            selectedImage: getThemeAssets().tabBar.tab_setting_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('MapSetting', { type })
            },
          })
          break
        case 'Scene':
          list.push({
            key: 'scene',
            title: getLanguage(global.language).Map_Label.SCENE,
            //'场景',
            image: getThemeAssets().tabBar.tab_scene,
            selectedImage: getThemeAssets().tabBar.tab_scene_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Map3D', {
                  type: 'MAP_3D',
                })
            },
          })
          break
        case 'Layer3D':
          list.push({
            key: 'Layer3DManager',
            title: getLanguage(global.language).Map_Label.LAYER,
            //'图层',
            image: getThemeAssets().tabBar.tab_layer,
            selectedImage: getThemeAssets().tabBar.tab_layer_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Layer3DManager', {
                  type: 'MAP_3D',
                })
            },
          })
          break
        case 'Attribute3D':
          list.push({
            key: 'LayerAttribute3D',
            title: getLanguage(global.language).Map_Label.ATTRIBUTE,
            //'属性',
            image: getThemeAssets().tabBar.tab_attribute,
            selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAttribute3D', {
                  type: 'MAP_3D',
                })
            },
          })
          break
        case 'Settings3D':
          list.push({
            key: 'Setting',
            title: getLanguage(global.language).Map_Label.SETTING,
            //'设置',
            image: getThemeAssets().tabBar.tab_setting,
            selectedImage: getThemeAssets().tabBar.tab_setting_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Map3DSetting', {})
            },
          })
          break
      }
    }

    // switch (type) {
    //   case constants.MAP_EDIT:
    //   case constants.MAP_PLOTTING:
    //   case constants.MAP_COLLECTION:
    //   case constants.MAP_THEME:
    //   case constants.MAP_ANALYST:
    //   case constants.MAP_NAVIGATION:
    //   case constants.MAP_AR:
    //     list = [
    //       {
    //         key: 'MapView',
    //         title:
    //           type === constants.MAP_AR
    //             ? getLanguage(global.language).Map_Label.ARMAP
    //             : getLanguage(global.language).Map_Label.MAP,
    //         //'地图',
    //         image: getThemeAssets().tabBar.tab_map,
    //         selectedImage: getThemeAssets().tabBar.tab_map_selected,
    //         btnClick: () => {
    //           this.props.navigation &&
    //             this.props.navigation.navigate('MapView', { type })
    //         },
    //       },
    //       {
    //         key: 'LayerManager',
    //         title: getLanguage(global.language).Map_Label.LAYER,
    //         //'图层',
    //         image: getThemeAssets().tabBar.tab_layer,
    //         selectedImage: getThemeAssets().tabBar.tab_layer_selected,
    //         btnClick: () => {
    //           this.props.navigation &&
    //             this.props.navigation.navigate('LayerManager', { type })
    //         },
    //       },
    //       {
    //         key: 'LayerAttribute',
    //         title: getLanguage(global.language).Map_Label.ATTRIBUTE,
    //         //'属性',
    //         image: getThemeAssets().tabBar.tab_attribute,
    //         selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
    //         btnClick: () => {
    //           this.props.navigation &&
    //             this.props.navigation.navigate('LayerAttribute', { type })
    //         },
    //       },
    //       {
    //         key: 'MapSetting',
    //         title: getLanguage(global.language).Map_Label.SETTING,
    //         //'设置',
    //         image: getThemeAssets().tabBar.tab_setting,
    //         selectedImage: getThemeAssets().tabBar.tab_setting_selected,
    //         btnClick: () => {
    //           this.props.navigation &&
    //             this.props.navigation.navigate('MapSetting', { type })
    //         },
    //       },
    //     ]
    //     break
    //   // case constants.MAP_ANALYST:
    //   //   list = [
    //   //     {
    //   //       key: 'MapAnalystView',
    //   //       title: getLanguage(global.language).Map_Label.MAP,
    //   //       image: require('../../../../assets/mapToolbar/Frenchgrey/icon_map.png'),
    //   //       selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_map_selected.png'),
    //   //       btnClick: () => {
    //   //         this.props.navigation &&
    //   //           this.props.navigation.navigate('MapAnalystView', { type })
    //   //       },
    //   //     },
    //   //     {
    //   //       key: 'AnalystTools',
    //   //       title: getLanguage(global.language).Map_Label.TOOL_BOX,
    //   //       image: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute.png'),
    //   //       selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute_selected.png'),
    //   //       btnClick: () => {
    //   //         this.props.navigation &&
    //   //           this.props.navigation.navigate('AnalystTools', { type })
    //   //       },
    //   //     },
    //   //     {
    //   //       key: 'LayerAnalystManager',
    //   //       title: getLanguage(global.language).Map_Label.LAYER,
    //   //       image: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer.png'),
    //   //       selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer_selected.png'),
    //   //       btnClick: () => {
    //   //         this.props.navigation &&
    //   //           this.props.navigation.navigate('LayerAnalystManager', { type })
    //   //       },
    //   //     },
    //   //   ]
    //   //   break
    //   case constants.MAP_3D:
    //     list = [
    //       {
    //         key: 'scene',
    //         title: getLanguage(global.language).Map_Label.SCENE,
    //         //'场景',
    //         image: getThemeAssets().tabBar.tab_scene,
    //         selectedImage: getThemeAssets().tabBar.tab_scene_selected,
    //         btnClick: () => {
    //           this.props.navigation &&
    //             this.props.navigation.navigate('Map3D', {
    //               type: 'MAP_3D',
    //             })
    //         },
    //       },
    //       {
    //         key: 'Layer3DManager',
    //         title: getLanguage(global.language).Map_Label.LAYER,
    //         //'图层',
    //         image: getThemeAssets().tabBar.tab_layer,
    //         selectedImage: getThemeAssets().tabBar.tab_layer_selected,
    //         btnClick: () => {
    //           this.props.navigation &&
    //             this.props.navigation.navigate('Layer3DManager', {
    //               type: 'MAP_3D',
    //             })
    //         },
    //       },
    //       {
    //         key: 'LayerAttribute3D',
    //         title: getLanguage(global.language).Map_Label.ATTRIBUTE,
    //         //'属性',
    //         image: getThemeAssets().tabBar.tab_attribute,
    //         selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
    //         btnClick: () => {
    //           this.props.navigation &&
    //             this.props.navigation.navigate('LayerAttribute3D', {
    //               type: 'MAP_3D',
    //             })
    //         },
    //       },
    //       {
    //         key: 'Setting',
    //         title: getLanguage(global.language).Map_Label.SETTING,
    //         //'设置',
    //         image: getThemeAssets().tabBar.tab_setting,
    //         selectedImage: getThemeAssets().tabBar.tab_setting_selected,
    //         btnClick: () => {
    //           // this._map3Dchange()
    //           // let file=["/storage/emulated/0/iTablet/data/local/Changchun"]
    //           // let toPath="/storage/emulated/0/iTablet/data/local/Changchun.zip"
    //           // let path="/storage/emulated/0/iTablet/data"
    //           // SScene.doZipFiles(file,toPath)
    //           // Utility.unZipFile(toPath,path)
    //           this.props.navigation &&
    //             this.props.navigation.navigate('Map3DSetting', {})
    //         },
    //       },
    //     ]
    //     break
    //   // case constants.MAP_NAVIGATION:
    //   //   list = [
    //   //     {
    //   //       key: 'MapView',
    //   //       title:
    //   //         type === constants.MAP_AR
    //   //           ? getLanguage(global.language).Map_Label.ARMAP
    //   //           : getLanguage(global.language).Map_Label.MAP,
    //   //       //'地图',
    //   //       image: getThemeAssets().tabBar.tab_map,
    //   //       selectedImage: getThemeAssets().tabBar.tab_map,
    //   //       btnClick: () => {
    //   //         this.props.navigation &&
    //   //           this.props.navigation.navigate('MapView', { type })
    //   //       },
    //   //     },
    //   //     {
    //   //       key: 'LayerManager',
    //   //       title: getLanguage(global.language).Map_Label.LAYER,
    //   //       //'图层',
    //   //       image: getThemeAssets().tabBar.tab_layer,
    //   //       selectedImage: getThemeAssets().tabBar.tab_layer_selected,
    //   //       btnClick: () => {
    //   //         this.props.navigation &&
    //   //           this.props.navigation.navigate('LayerManager', { type })
    //   //       },
    //   //     },
    //   //     {
    //   //       key: 'LayerAttribute',
    //   //       title: getLanguage(global.language).Map_Label.ATTRIBUTE,
    //   //       //'属性',
    //   //       image: getThemeAssets().tabBar.tab_attribute,
    //   //       selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
    //   //       btnClick: () => {
    //   //         this.props.navigation &&
    //   //           this.props.navigation.navigate('LayerAttribute', { type })
    //   //       },
    //   //     },
    //   //     {
    //   //       key: 'MapSetting',
    //   //       title: getLanguage(global.language).Map_Label.SETTING,
    //   //       //'设置',
    //   //       image: getThemeAssets().tabBar.tab_setting,
    //   //       selectedImage: getThemeAssets().tabBar.tab_setting_selected,
    //   //       btnClick: () => {
    //   //         this.props.navigation &&
    //   //           this.props.navigation.navigate('MapSetting', {
    //   //             type,
    //   //           })
    //   //       },
    //   //     },
    //   //   ]
    //   //   break
    // }
    return list
  }

  _map3Dchange = () => {
    NavigationService.navigate('WorkspaceFileList', { type: constants.MAP_3D })
  }

  _renderItem = ({ item, index }) => {
    return (
      <MT_Btn
        key={item.key}
        title={item.title}
        textColor={'#505050'}
        textStyle={{ fontSize: setSpText(20) }}
        selected={this.state.currentIndex === index}
        image={item.image}
        selectedImage={item.selectedImage}
        onPress={() => {
          let current = this.props.initIndex
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].key === this.props.navigation.state.key) {
              current = i
            }
          }
          if (current !== index) {
            // this.setState({
            //   currentIndex: index,
            // })
            item.btnClick && item.btnClick()
          }
        }}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator mode={ListSeparator.mode.VERTICAL} />
  }

  _keyExtractor = item => item.key

  renderItems = data => {
    let toolbar = []
    data.forEach((item, index) => {
      toolbar.push(this._renderItem({ item, index }))
    })
    return toolbar
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {/*<FlatList*/}
        {/*data={this.state.data}*/}
        {/*renderItem={this._renderItem}*/}
        {/*// ItemSeparatorComponent={this._renderItemSeparatorComponent}*/}
        {/*keyExtractor={this._keyExtractor}*/}
        {/*horizontal={true}*/}
        {/*/>*/}
        {this.renderItems(this.state.data)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: scaleSize(96),
    width: '100%',
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
