import * as React from 'react'
import { FlatList } from 'react-native'
import { Container, ListSeparator } from '../../components'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'
import { MapListItem } from './components'

export default class MapChange extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { state } = this.props.navigation
    this.workspace = state.params.workspace
    this.map = state.params.map
    this.cb = state.params.cb
    ;(async function() {
      let maps = await this.workspace.getMaps()
      let count = await maps.getCount()
      let mapNameArr = []
      for (let i = 0; i < count; i++) {
        let name = await maps.get(i)
        let map = this.map
        mapNameArr.push({ key: name, num: i, map: map })
      }
      this.setState(
        {
          dataList: mapNameArr,
        },
        () => {
          this.container.setLoading(false)
        },
      )
    }.bind(this)())
  }

  state = {
    dataList: '',
  }

  _map_change = ({ key, map }) => {
    (async function() {
      await map.close()
      await map.open(key)
      await map.refresh()
      // NavigationService.goBack()
      this.cb && this.cb()

      let routes = this.props.nav.routes
      let routeKey = ''
      for (let i = 0; i < routes.length - 1; i++) {
        if (routes[i].routeName === 'MapView') {
          routeKey = routes[i + 1].key
        }
      }
      NavigationService.goBack(routeKey)

      Toast.show('地图切换成功')
    }.bind(this)())
  }

  _renderItem = ({ item }) => {
    return (
      <MapListItem
        data={item}
        onPress={() => {
          this._map_change(item)
        }}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        initWithLoading
        headerProps={{
          title: '地图切换',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          data={this.state.dataList}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
        />
      </Container>
    )
  }
}
