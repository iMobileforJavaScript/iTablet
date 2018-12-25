import * as React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Thumbnails, EmptyView } from '../../../../components'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { Const } from '../../../../constants'
// import MapView from '../../../mapView'

export default class HomeUsualMap extends React.Component {
  props: {
    data: Object,
  }

  constructor(props) {
    super(props)
  }

  _btnClick = obj => {
    if (obj.type === Const.MAP_3D) {
      NavigationService.navigate('Map3D', {
        data: obj,
        type: obj.type,
        path: obj.path,
        manageAble: true,
      })
    } else {
      NavigationService.navigate('MapView', obj)
    }
  }

  _renderItem = ({ item }) => {
    let image
    if (item.image) {
      image = item.image
    } else {
      if (item.path && item.path.indexOf('凯德Mall') >= 0) {
        image = require('../../../../assets/public/map3D.png')
      } else if (item.path && item.path.indexOf('MaSai') >= 0) {
        image = require('../../../../assets/public/ObliquePhoto.png')
      } else {
        image = require('../../../../assets/public/default-3d-map.png')
      }
    }
    return (
      <Thumbnails
        imageStyle={styles.item}
        key={item.name}
        title={item.name}
        src={image}
        btnClick={() => {
          this._btnClick(item)
        }}
      />
    )
  }

  _keyExtractor = (item, index) => index + '-' + item.name

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>最近常用</Text>
        </View>
        {this.props.data && this.props.data.length > 0 ? (
          <FlatList
            style={styles.listView}
            data={this.props.data}
            renderItem={this._renderItem}
            horizontal={true}
            keyExtractor={this._keyExtractor}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <EmptyView
            style={{ backgroundColor: 'transparent' }}
            title={'您最近还未使用过地图'}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: scaleSize(15),
    // height:scaleSize(330),
    padding: scaleSize(5),
    minHeight: scaleSize(330),
    backgroundColor: '#FFFFFF',
  },
  listView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingHorizontal: scaleSize(15),
  },
  header: {
    height: scaleSize(50),
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginLeft: scaleSize(40),
    // paddingTop:scaleSize(10),
  },
  headerTitle: {
    fontSize: size.fontSize.fontSizeXl,
    color: color.content,
  },
  imageStyle: {
    backgroundColor: color.grayLight,
  },
})
