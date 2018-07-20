import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'

import NavigationService from '../../../containers/NavigationService'
import Thumbnails from '../../../components/Thumbnails'
import { color } from '../../../styles'
import { scaleSize, Toast } from '../../../utils'
import { Utility } from 'imobile_for_javascript'

const defalutImageSrc = require('../../../assets/public/mapImage0.png')
const vectorMap = '矢量地图',map3D = '三维场景',ObliquePhoto = '倾斜摄影', gl = 'GL地图瓦片', overLay = '影像叠加矢量地图'
const testData = [{ key: vectorMap }, { key: ObliquePhoto }, { key: gl }, { key: overLay }, { key: map3D }, { key: 'CAD' }]

export default class ExampleMapList extends React.Component {
  _itemClick = async key => {
    let path, exist, filePath
    switch(key){
      case vectorMap:
        // path = '/SampleData/Changchun/Changchun.smwu'
        // path = '/SampleData/FacilityAnalyst/FacilityAnalyst.smwu'
        path = '/SampleData/beijing_new/beijing.smwu'
        // path = '/SampleData/world/world.smwu'
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('MapView', { path:  path})
        } else {
          Toast.show("本地实例文件不存在")
        }
        break
      case map3D:
        path = '/SampleData/凯德Mall/凯德Mall.sxwu'
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('Map3D', { path:  path, manageAble: true})
        } else {
          Toast.show("本地实例文件不存在")
        }
        break
      case ObliquePhoto:
        path = '/SampleData/MaSai/MaSai.sxwu'
        // path = '/SampleData/CBD_android/CBD_android.sxwu'
        exist = await Utility.fileIsExistInHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('Map3D', { path:  path, manageAble: true})
        } else {
          Toast.show("本地实例文件不存在")
        }
        break
      case gl:
        path = '/SampleData/Changchun/Changchun.udb'
        exist = await Utility.fileIsExistInHomeDirectory(path)
        filePath = await Utility.appendingHomeDirectory(path)
        if (exist) {
          NavigationService.navigate('MapView', { type: 'UDB', path: filePath})
        } else {
          Toast.show("本地实例文件不存在")
        }
        // Toast.show('待完善')
        break
      default:
        Toast.show('待完善')
        break
    }
  }

  _renderItem = ({ item }) => {
    let key = item.key
    let src = defalutImageSrc
    switch (key){
      case vectorMap:
        src = require('../../../assets/public/beijing.png')
        break
      case map3D:
        src = require('../../../assets/public/map3D.png')
        break
      case ObliquePhoto:
        src = require('../../../assets/public/ObliquePhoto.png')
        break
      default:
        src = require('../../../assets/public/VectorMap.png')
        break
    }
    return (
      <Thumbnails title={key} src={src} btnClick={()=>this._itemClick(key)} />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={testData}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // item: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   height: 40,
  //   width: width,
  //   paddingLeft: 15,
  //   backgroundColor: color.grayLight,
  // },
  // container: {
  //   flex: 1,
  //   backgroundColor: 'white',
  //   alignSelf: 'center',
  // },
  container: {
    flex: 1,
    backgroundColor: color.grayLight,
    paddingHorizontal: scaleSize(20),
    flexDirection: 'column',
    paddingTop: scaleSize(20),
  },
})