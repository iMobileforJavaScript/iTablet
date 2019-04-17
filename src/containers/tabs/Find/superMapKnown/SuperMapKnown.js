import React, { Component } from 'react'
import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container } from '../../../../components'
import styles from './styles'
import { SOnlineService } from 'imobile_for_reactnative'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
export default class SuperMapKnown extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    try {
      let result = await SOnlineService.getSuperMapKnown()
      //   console.log(result)
      this.setState({ data: result })
    } catch (error) {
      Toast.show('请求失败请检查网络')
    }
  }

  _renderitem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemBtn}
        onPress={() => {
          NavigationService.navigate('Protocol', {
            type: 'superMapKnown',
            knownItem: { id: item.id },
          })
        }}
      >
        <View style={styles.leftView}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {/* <Text style={styles.itemInformation}>简介:超图知道公众号文章</Text> */}
          <Text style={styles.itemTime}>时间:{item.time}</Text>
        </View>
        <View style={styles.rightView}>
          <Image source={{ uri: item.img }} style={styles.img} />
        </View>
      </TouchableOpacity>
    )
  }

  _itemSeparatorComponent = () => {
    return <View style={styles.itemSeparator} />
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Prompt.SUPERMAP_KNOW,
          //'超图知道',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          ref={ref => (this.flast = ref)}
          renderItem={this._renderitem}
          ItemSeparatorComponent={this._itemSeparatorComponent}
          data={this.state.data}
          style={{}}
          initialNumToRender={6}
        />
      </Container>
    )
  }
}
