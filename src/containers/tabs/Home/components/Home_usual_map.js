import * as React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Thumbnails, EmptyView } from '../../../../components'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import MapView from '../../../mapView'

export default class HomeUsualMap extends React.Component {

  props: {
    data: Object,
  }

  constructor(props){
    super(props)
    // this.state = {
    //   data: [
    //     {
    //       name: '成都市',
    //       path: '/SampleData/Changchun/Changchun.smwu',
    //     },
    //     {
    //       name: '北京市',
    //       path: 'https://www.supermapol.com/apps/viewer/2095221593',
    //       image: require('../../../../assets/public/mapImage1.png'),
    //     },
    //   ],
    // }
  }

  _btnClick = obj => {
    // if (obj.type === MapView.Type.MAP_3D) {
    // NavigationService.navigate('Map3D', { data: obj, type: MapView.Type.MAP_3D, path: obj.path })
    // NavigationService.navigate('Map3D', { data: obj, type: MapView.Type.MAP_3D, path: obj.path, manageAble: true })
    // } else if(obj.path && obj.path.indexOf('http') >= 0) {
    //   NavigationService.navigate('MapView', { data: obj, type: MapView.Type.ONLINE, path: obj.path })
    // } else if(obj.type === '') {
    //   NavigationService.navigate('MapView', { data: obj, type:path: obj.path })
    // }
    if (obj.type === MapView.Type.MAP_3D) {
      NavigationService.navigate('Map3D', { data: obj, type: obj.type, path: obj.path, manageAble: true })
    } else {
      NavigationService.navigate('MapView', { data: obj, type: obj.type, path: obj.path })
    }
  }

  _renderItem = ({item}) => {
    let image
    if (item.path) {
      if (item.path.indexOf('beijing') >= 0) {
        image = require('../../../../assets/public/beijing.png')
      } else if (item.path.indexOf('凯德Mall') >= 0) {
        image = require('../../../../assets/public/map3D.png')
      } else if (item.path.indexOf('MaSai') >= 0) {
        image = require('../../../../assets/public/ObliquePhoto.png')
      } else {
        image = require('../../../../assets/public/beijing.png')
      }
    } else {
      image = item.image
    }
    return (
      <Thumbnails
        key={item.name}
        title={item.name}
        // src={item.image}
        src={image}
        btnClick={() => {
          this._btnClick(item)
        }}/>
    )
  }

  _keyExtractor = (item, index) => (index + '-' + item.name)

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitile}>最近常用</Text>
        </View>
        {
          this.props.data && this.props.data.length > 0
            ? <FlatList
              style={styles.listView}
              data={this.props.data}
              renderItem={this._renderItem}
              horizontal={false}
              keyExtractor={this._keyExtractor}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
            : <EmptyView style={{backgroundColor: 'transparent'}} title={'您最近还未使用过地图'} />
        }

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.grayLight,
    paddingHorizontal: scaleSize(20),
    flexDirection: 'column',
    paddingTop: scaleSize(20),
  },
  listView: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
  },
  header: {
    height: scaleSize(40),
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginLeft: scaleSize(40),
  },
  headerTitile: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.content,
  },
})