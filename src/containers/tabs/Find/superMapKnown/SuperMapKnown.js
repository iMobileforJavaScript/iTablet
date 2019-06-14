import React, { Component } from 'react'
import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container } from '../../../../components'
import styles from './styles'
// import { SOnlineService } from 'imobile_for_reactnative'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
export default class SuperMapKnown extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const params = this.props.navigation.state.params
    this.type = params.type
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    try {
      // var result;
      let uri
      switch (this.type) {
        case 'SuperMapKnow':
          // let result = await SOnlineService.getSuperMapKnown()
          // this.setState({ data: result })
          uri = 'http://111.202.121.144:8088/officialAccount/zhidao/data.json'
          break
        case 'SuperMapGroup':
          uri =
            'http://111.202.121.144:8088/officialAccount/SuperMapGroup/data.json'
          break
      }
      fetch(uri)
        .then(response => response.json())
        .then(responseJson => {
          // return responseJson.movies;
          let result = responseJson
          this.setState({ data: result })
          if (this.props.navigation.state.params.callback != null) {
            this.props.navigation.state.params.callback()
          }
        })
        .catch(() => {})
      //   console.log(result)
      // this.setState({ data: result })
    } catch (error) {
      Toast.show('请求失败请检查网络')
    }
  }

  _renderitem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemBtn}
        onPress={() => {
          switch (this.type) {
            case 'SuperMapKnow':
              NavigationService.navigate('Protocol', {
                type: 'superMapKnown',
                knownItem: { id: item.id },
              })
              break
            case 'SuperMapGroup':
              NavigationService.navigate('Protocol', {
                type: 'SuperMapGroup',
                knownItem: { id: item.id },
              })
              break
          }
        }}
      >
        <View style={styles.leftView}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {/* <Text style={styles.itemInformation}>简介:超图知道公众号文章</Text> */}
          <Text style={styles.itemTime}>时间:{item.time}</Text>
        </View>
        <View style={styles.rightView}>
          <Image source={{ uri: item.cover }} style={styles.img} />
        </View>
      </TouchableOpacity>
    )
  }

  _itemSeparatorComponent = () => {
    return <View style={styles.itemSeparator} />
  }

  render() {
    var tempTitle
    switch (this.type) {
      case 'SuperMapKnow':
        tempTitle = getLanguage(global.language).Prompt.SUPERMAP_KNOW
        break
      case 'SuperMapGroup':
        tempTitle = getLanguage(global.language).Prompt.SUPERMAP_GROUP
        break
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: tempTitle,
          //'超图知道',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          ref={ref => (this.flast = ref)}
          renderItem={this._renderitem}
          ItemSeparatorComponent={this._itemSeparatorComponent}
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()} //不重复的key
          style={{}}
          initialNumToRender={6}
        />
      </Container>
    )
  }
}
