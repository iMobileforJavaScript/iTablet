import * as React from 'react'
import styles from './styles'
import {
  View,
  TouchableOpacity,
  Text,
  SectionList,
  FlatList,
  Image,
} from 'react-native'
import { SScene } from 'imobile_for_reactnative'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'

export default class Map3DToolBar extends React.Component {
  props: {
    type: string,
    data: Array,
    device: Object,
    setFly: () => {},
    setAnimation: () => {},
    showToolbar: () => {},
    existFullMap: () => {},
    importSceneWorkspace: () => {},
    refreshLayer3dList: () => {},
    setVisible: () => {},
    getLayer3d: () => {},
    getoverlayView: () => {},
    newFly: () => {},
    changeLayerList: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      type: props.type,
      analystresult: 0,
    }
  }
  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.setState({
        data: nextProps.data,
      })
    }
  }

  changeBaseMap = (url, type, name) => {
    switch (type) {
      case 'WMTS':
        SScene.addLayer3D(
          url,
          type,
          name,
          'JPG_PNG',
          96.0,
          true,
          'c768f9fd3e388eb0d155405f8d8c6999',
        ).then(result => {
          if (result) {
            Toast.show('添加成功')
          } else {
            Toast.show('添加失败')
          }
        })
        break
      case 'l3dBingMaps':
        SScene.addLayer3D(
          url,
          type,
          name,
          'JPG_PNG',
          96.0,
          true,
          'c768f9fd3e388eb0d155405f8d8c6999',
        ).then(result => {
          if (result) {
            Toast.show('添加成功')
          } else {
            Toast.show('添加失败')
          }
        })
        break
      default:
        Toast.show('底图不存在')
        break
    }
    this.props.refreshLayer3dList && this.props.refreshLayer3dList()
  }

  setAnalystResult = data => {
    this.setState({
      analystresult: data,
    })
  }

  renderListItem = ({ item, index }) => {
    if (this.props.type === 'MAP3D_BASE') {
      if (item.show) {
        return (
          // <TouchableOpacity
          //   onPress={() => this.changeBaseMap(item.url, item.type, item.name)}
          // >
          //   <Text style={styles.item}>{item.title}</Text>
          // </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              let layer3d = this.props.getLayer3d && this.props.getLayer3d()
              let overlayView =
                this.props.getoverlayView && this.props.getoverlayView()
              if (item.title === layer3d.name) {
                Toast.show('底图已存在')
                return
              }
              this.changeBaseMap(item.url, item.type, item.name)
              this.props.setVisible && this.props.setVisible(false)
              overlayView && overlayView.setVisible(false)
              // this.props.existFullMap && this.props.existFullMap(true)
              // this.props.showToolbar && this.props.showToolbar(false)
              // GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)
            }}
            style={styles.sceneItem}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../../../../../assets/mapToolbar/list_type_map_black.png')}
                style={styles.baseMapImg}
              />
              <View style={styles.baseMapTitle}>
                <Text style={[styles.baseText]}>{item.title}</Text>
              </View>
            </View>
            {this.renderItemSeparatorComponent()}
          </TouchableOpacity>
        )
      } else {
        return <View />
      }
    }
    if (this.props.type === 'MAP3D_ADD_LAYER') {
      return (
        <TouchableOpacity onPress={item.action()}>
          <Text style={styles.item}>{item.title}</Text>
        </TouchableOpacity>
      )
    }
    if (this.props.type === 'MAP3D_TOOL_FLYLIST') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.setFly(index)
          }}
          style={styles.sceneItem}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../../../../assets/function/Frenchgrey/icon_symbolFly.png')}
              style={styles.sceneItemImg}
            />
            <View style={styles.sceneItemcontent}>
              <Text style={[styles.workspaceItem]}>{item.title}</Text>
            </View>
          </View>
          {this.renderItemSeparatorComponent()}
        </TouchableOpacity>
      )
    }
    if (this.props.type === 'MAP_PLOTTING_ANIMATION') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.setAnimation(item.path)
          }}
          style={styles.sceneItem}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.sceneItemcontent}>
              <Text style={[styles.workspaceItem]}>{item.title}</Text>
            </View>
          </View>
          {this.renderItemSeparatorComponent()}
        </TouchableOpacity>
      )
    }
    return <View />
  }

  renderListSectionHeader = ({ section }) => {
    if (this.props.type === 'MAP3D_BASE') {
      return (
        // <View style={styles.sceneView}>
        //   <Image
        //     source={require('../../../../assets/mapToolbar/list_type_maps.png')}
        //     style={styles.sceneImg}
        //   />
        //   <Text style={styles.sceneTitle}>{section.title}</Text>
        // </View>
        <View />
      )
    }
    if (this.props.type === 'MAP3D_ADD_LAYER') {
      return <View />
    }
    if (this.props.type === 'MAP3D_TOOL_FLYLIST') {
      // return <Text style={styles.sectionHeader}>{section.title}</Text>
      return (
        <View style={styles.fltListHeader}>
          <View style={styles.sceneView}>
            <Image
              source={require('../../../../../../assets/function/Frenchgrey/icon_symbolFly_white.png')}
              style={styles.sceneImg}
            />
            <Text style={styles.sceneTitle}>{section.title}</Text>
          </View>
          <TouchableOpacity
            style={styles.newView}
            onPress={() => {
              this.props.newFly && this.props.newFly()
            }}
          >
            <Image
              source={require('../../../../../../assets/map/Frenchgrey/scene_addfly_light.png')}
              style={styles.newRout}
            />
          </TouchableOpacity>
        </View>
      )
    }
    if (this.props.type === 'MAP_PLOTTING_ANIMATION') {
      // return <Text style={styles.sectionHeader}>{section.title}</Text>
      return (
        <View style={styles.fltListHeader}>
          <View style={styles.sceneView}>
            <Image
              source={require('../../../../../../assets/function/Frenchgrey/icon_symbolFly_white.png')}
              style={styles.sceneImg}
            />
            <Text style={styles.sceneTitle}>{section.title}</Text>
          </View>
          {/* <TouchableOpacity
            style={styles.newView}
            onPress={() => {
              this.props.newFly && this.props.newFly()
            }}
          >
            <Image
              source={require('../../../../assets/map/Frenchgrey/scene_addfly_light.png')}
              style={styles.newRout}
            />
          </TouchableOpacity> */}
        </View>
      )
    }
  }

  renderItemSeparatorComponent = () => {
    return (
      <View
        style={[
          styles.Separator,
          {
            width: this.props.device.width,
            // marginLeft: 0.022 * this.props.device.width,
          },
        ]}
      />
    )
  }

  refreshList = section => {
    let newData = this.state.data
    for (let index = 0; index < section.data.length; index++) {
      section.data[index].show = !section.data[index].show
    }
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  openWorkspace = item => {
    if (item.name === GLOBAL.sceneName) {
      Toast.show(getLanguage(global.language).Prompt.THE_SCENE_IS_OPENED)
      //'场景已打开,请勿重复打开场景')
      return
    }
    SScene.openScence(item.name).then(() => {
      SScene.setNavigationControlVisible(false)
      SScene.setListener()
      SScene.getAttribute()
      SScene.setCircleFly()
      SScene.setAction('PAN3D')
      SScene.changeBaseLayer(1)
      // SScene.addLayer3D(
      //   'http://t0.tianditu.com/img_c/wmts',
      //   'l3dBingMaps',
      //   'bingmap',
      //   'JPG_PNG',
      //   96.0,
      //   true,
      //   'c768f9fd3e388eb0d155405f8d8c6999',
      // )
      GLOBAL.action3d = 'PAN3D'
      GLOBAL.openWorkspace = true
      GLOBAL.sceneName = item.name
      this.props.refreshLayer3dList && this.props.refreshLayer3dList()
      this.props.existFullMap && this.props.existFullMap(true)
      this.props.showToolbar && this.props.showToolbar(false)
      GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)
      this.props.changeLayerList && this.props.changeLayerList()
    })
  }

  importWorkspace = async item => {
    (await this.props.importSceneWorkspace) &&
      this.props.importSceneWorkspace({ server: item.path })(
        await this.props.existFullMap,
      ) &&
      this.props.existFullMap(true)(await this.props.showToolbar) &&
      this.props.showToolbar(false)
  }

  renderItem = ({ item }) => {
    if (this.props.type === 'MAP3D_WORKSPACE_LIST') {
      let info
      if (global.language === 'CN') info = item.mtime
      else if (global.language === 'EN') {
        let day = item.mtime
          .replace(/年|月|日/g, '/')
          .split('  ')[0]
          .split('/')
        info =
          day[2] +
          '/' +
          day[1] +
          '/' +
          day[0] +
          '  ' +
          item.mtime.split('  ')[1]
      }

      return (
        <TouchableOpacity
          onPress={() => {
            this.openWorkspace(item)
          }}
          style={styles.sceneItem}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../../../../assets/mapToolbar/list_type_map_black.png')}
              style={styles.sceneItemImg}
            />
            <View style={styles.sceneItemcontent}>
              <Text style={[styles.workspaceItem]}>{item.name}</Text>
              <Text style={styles.itemTime}>
                {getLanguage(global.language).Prompt.LATEST}
                {/* 最后修改时间:  */}
                {info}
              </Text>
            </View>
          </View>
          {this.renderItemSeparatorComponent()}
        </TouchableOpacity>
      )
    }
    if (this.props.type === 'MAP3D_IMPORTWORKSPACE') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.importWorkspace(item)
          }}
          style={styles.sceneItem}
        >
          <Text style={styles.item}>{item.name}</Text>
        </TouchableOpacity>
      )
    }
    item.name = item.name.toUpperCase()
    if (
      item.name === 'SMUSERID' ||
      item.name === 'MODELNAME' ||
      item.name === 'LONGITUDE' ||
      item.name === 'LATITUDE' ||
      item.name === 'ALTITUDE'
    ) {
      return (
        <TouchableOpacity style={styles.row}>
          <View style={styles.key}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.text}>{item.value}</Text>
          </View>
        </TouchableOpacity>
      )
    } else if (
      (item.name === 'DESCRIPTION' && item.value !== '') ||
      (item.name === 'NAME' && item.value !== '')
    ) {
      return (
        <TouchableOpacity style={styles.row}>
          <View style={styles.key}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
          <View style={styles.value}>
            <Text style={styles.text}>{item.value}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  render() {
    if (
      this.props.type === 'MAP3D_ATTRIBUTE' ||
      this.props.type === 'MAP3D_IMPORTWORKSPACE'
    ) {
      return (
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index}
        />
      )
    } else if (this.props.type === 'MAP3D_WORKSPACE_LIST') {
      return (
        <View style={styles.sceneHead}>
          <View style={styles.sceneView}>
            <Image
              source={require('../../../../../../assets/mapToolbar/list_type_maps.png')}
              style={styles.sceneImg}
            />
            <Text style={styles.sceneTitle}>
              {getLanguage(global.language).Map_Label.SCENE}
              {/* 场景 */}
            </Text>
          </View>
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index}
          />
        </View>
      )
    } else {
      return (
        <SectionList
          sections={this.state.data}
          // ItemSeparatorComponent={this.renderItemSeparatorComponent}
          renderItem={this.renderListItem}
          renderSectionHeader={this.renderListSectionHeader}
          // SectionSeparatorComponent={this.renderItemSeparatorComponent}
          keyExtractor={(item, index) => index}
        />
      )
    }
  }
}
