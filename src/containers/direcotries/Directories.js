/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { FlatList } from 'react-native'
import { Container } from '../../components'

export default class Directories extends React.Component {
  props: {
    navigation: any,
  }

  constructor(props) {
    super(props)
    const { state } = this.props.navigation
    this.workspace = state.params.workspace
    this.map = state.params.map
  }

  // _test_change = (text) => {
  //   this.setState({ InputText: text })
  // }
  //
  // _addlayer = async () => {
  //   let name = this.state.InputText
  //   let type = this.type
  //   let dataSources = await this.workspace.getDatasources()
  //   let dataSource = await dataSources.get(0)
  //   let dsVector = await dataSource.createDatasetVector(name,type,0)
  //   await this.map.addLayer(dsVector,true)
  //   await this.map.refresh()
  // }
  //

  //item渲染方法
  // _renderItem=({item})=>(
  //   <View style={styles.itemContainer}>
  //     <Image style={styles.itemImage} source={item.Image}/>
  //     <Text style={styles.itemText}>{item.Text}</Text>
  //   </View>
  // );
  //
  // //分割线组件
  // _separator=()=>{
  //   return <View style={{height:1 / PixelRatio.get(),backgroundColor: '#bbbbbb',marginLeft: 60}}/>
  // }

  render() {
    return (
      <Container
        headerProps={{
          title: '添加数据集',
          navigation: this.props.navigation,
          headerRight: [],
        }}
      >
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._separator}
        />
      </Container>
    )
  }
}
