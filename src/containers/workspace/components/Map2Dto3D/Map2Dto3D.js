import * as React from 'react'
import { SMMapView, SMSceneView, SScene } from 'imobile_for_reactnative'
import styles from './styles'
import { View } from 'react-native'
// import { FileTools } from '../../../../native'
// import { ConstPath } from '../../../../constants'

export default class Map2Dto3D extends React.Component {
  props: {
    mapIs3D: boolean,
    openWorkspace: () => {},
    openMap: () => {},
  }

  constructor(props) {
    super(props)
  }

  _onGetInstance = async mapView => {
    this.mapView = mapView
    this._addMap()
  }

  _onGetInstance3d = () => {
    this._addMap3d()
  }

  _addMap = () => {
    (async function() {
      // let homePath = await FileTools.appendingHomeDirectory()
      // let userPath = ConstPath.CustomerPath
      // let wsPath =
      //   homePath + userPath + ConstPath.RelativeFilePath.Navigation2DWorkspace
      try {
        // let result = await this.props.openWorkspace({ server: wsPath })
        // result && SMap.open2DNavigationMap()
        // SMap.startIndoorNavigation()
      } catch (e) {
        this.setLoading(false)
      }
    }.bind(this)())
  }

  _addMap3d = () => {
    (async function() {
      SScene.open3DNavigationMap()
    }.bind(this)())
  }

  render3DMap = () => {
    return <SMSceneView style={styles.map} onGetScene={this._onGetInstance3d} />
  }

  render2DMap = () => {
    return <SMMapView style={styles.map} onGetInstance={this._onGetInstance} />
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.mapIs3D && this.render3DMap()}
        {!this.props.mapIs3D && this.render2DMap()}
      </View>
    )
  }
}
