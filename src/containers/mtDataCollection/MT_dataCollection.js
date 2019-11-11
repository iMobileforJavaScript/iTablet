import * as React from 'react'
import { FlatList } from 'react-native'
import { Container, LayerItem, ListSeparator } from '../../components'
import { Action } from 'imobile_for_reactnative'

export default class MT_dataCollection extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: '',
      showList: false,
    }
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.isEdit = params.isEdit || false
    this.map = params.map
    this.type = params.type || 1
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.container.setLoading(true)
    ;(async function() {
      let layerCount = await this.map.getLayersCount()
      let layerNameArr = []

      // let mapName = this.map.getName()
      // let workspace = this.workspace.getCaption()
      for (let i = 0; i < layerCount; i++) {
        let layer = await this.map.getLayer(i)
        if (!layer) continue
        let name = await layer.getName()
        let caption = await layer.getCaption()
        let type = await (await layer.getDataset()).getType()
        let map = this.map
        layerNameArr.push({
          key: name,
          name: name,
          type: type,
          caption: caption,
          obj: layer,
          map: map,
        })
      }
      await this.mapControl.setAction(Action.PAN)
      this.setState(
        {
          data: layerNameArr,
          // mapName: mapName,
          // wsName: workspace,
        },
        () => {
          this.container.setLoading(false)
        },
      )
    }.bind(this)())
  }

  _renderItem = ({ item }) => {
    let key = item.id
    return (
      <LayerItem
        key={key}
        data={item}
        map={this.map}
        onPress={this._chooseEditLayer}
      />
    )
  }

  _renderSeparator = ({ leadingItem }) => {
    return <ListSeparator key={'separator_' + leadingItem.id} />
  }

  _keyExtractor = (item, index) => index

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '数据采集',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderSeparator}
        />
      </Container>
    )
  }
}
