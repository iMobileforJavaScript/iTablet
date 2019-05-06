import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
import { ListSeparator } from '../../../../components'
import constants from '../../constants'
import PropTypes from 'prop-types'
import NavigationService from '../../../../containers/NavigationService'
import MT_Btn from '../../../../components/mapTools/MT_Btn'
import { getLanguage } from '../../../../language/index'
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
  }

  static defaultProps = {
    type: constants.COLLECTION,
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
    switch (type) {
      case constants.MAP_EDIT:
      case constants.MAP_PLOTTING:
      case constants.COLLECTION:
      case constants.MAP_THEME:
        list = [
          {
            key: 'MapView',
            title: getLanguage(global.language).Map_Label.MAP,
            //'地图',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_map.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_map_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('MapView', { type })
            },
          },
          {
            key: 'LayerManager',
            title: getLanguage(global.language).Map_Label.LAYER,
            //'图层',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerManager', { type })
            },
          },
          {
            key: 'LayerAttribute',
            title: getLanguage(global.language).Map_Label.ATTRIBUTE,
            //'属性',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAttribute', { type })
            },
          },
          {
            key: 'MapSetting',
            title: getLanguage(global.language).Map_Label.SETTING,
            //'设置',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_setting.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_setting_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('MapSetting', { type })
            },
          },
        ]
        break
      case constants.MAP_ANALYST:
        list = [
          {
            key: 'MapAnalystView',
            title: '地图',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_map.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_map_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('MapAnalystView', { type })
            },
          },
          {
            key: 'AnalystTools',
            title: '工具箱',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('AnalystTools', { type })
            },
          },
          {
            key: 'LayerAnalystManager',
            title: '图层',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAnalystManager', { type })
            },
          },
        ]
        break
      case constants.MAP_3D:
        list = [
          {
            key: 'scene',
            title: getLanguage(global.language).Map_Label.SCENE,
            //'场景',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_scene.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_scene_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Map3D', {
                  type: 'MAP_3D',
                })
            },
          },
          {
            key: 'Layer3DManager',
            title: getLanguage(global.language).Map_Label.LAYER,
            //'图层',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_layer_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Map3DLayerManager', {
                  type: 'MAP_3D',
                })
            },
          },
          {
            key: 'LayerAttribute',
            title: getLanguage(global.language).Map_Label.ATTRIBUTE,
            //'属性',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_attribute_selected.png'),
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAttribute', {
                  type: 'MAP_3D',
                })
            },
          },
          {
            key: 'Setting',
            title: getLanguage(global.language).Map_Label.SETTING,
            //'设置',
            image: require('../../../../assets/mapToolbar/Frenchgrey/icon_setting.png'),
            selectedImage: require('../../../../assets/mapToolbar/Frenchgrey/icon_setting_selected.png'),
            btnClick: () => {
              // this._map3Dchange()
              // let file=["/storage/emulated/0/iTablet/data/local/Changchun"]
              // let toPath="/storage/emulated/0/iTablet/data/local/Changchun.zip"
              // let path="/storage/emulated/0/iTablet/data"
              // SScene.doZipFiles(file,toPath)
              // Utility.unZipFile(toPath,path)
              this.props.navigation &&
                this.props.navigation.navigate('Map3DSetting', {})
            },
          },
        ]
        break
    }
    return list
  }

  _map3Dchange = () => {
    NavigationService.navigate('WorkspaceFlieList', { type: constants.MAP_3D })
  }

  _renderItem = ({ item, index }) => {
    return (
      <MT_Btn
        key={item.key}
        title={item.title}
        textColor={'white'}
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
    backgroundColor: color.theme,
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
