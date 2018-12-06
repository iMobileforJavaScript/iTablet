import React, { Component } from 'react'
import { Container } from '../../components'
import { MapToolbar } from '../../containers/workspace/componets'
import {
  View,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  Switch,
} from 'react-native'
import styles from './styles'

export default class setting extends Component {
  props: {
    navigation: Object,
    data: Array,
  }
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params.type || 'MAP_3D'
    let data = props.data || this.getData(this.type)
    this.state = {
      data: data,
    }
  }

  getData = type => {
    let data = []
    switch (type) {
      case 'MAP_3D':
        // data = [
        //   {
        //     titile: '基本设置',
        //     visible: false,
        //     index: 0,
        //     data: [
        //       {
        //         name: '场景名称',
        //         value: 0,
        //         isShow: false,
        //         index: 0,
        //       },
        //     ],
        //   },
        //   {
        //     titile: '立体设置',
        //     visible: false,
        //     index: 1,
        //     data: [
        //       {
        //         name: "立体模式",
        //         value: "四缓存式立体",
        //         isShow: false,
        //         index: 1,
        //       }
        //     ],
        //   },
        //   {
        //     titile: '其他设置',
        //     visible: false,
        //     index: 2,
        //     data: [
        //       {
        //         name: "显示压盖对象",
        //         value: false,
        //         isShow: false,
        //         index: 2,
        //       }
        //     ],
        //   },
        //   {
        //     titile: '地球多边形偏移',
        //     visible: false,
        //     index: 3,
        //     data: [
        //       {
        //         name: "偏移常量",
        //         value: 0,
        //         isShow: false,
        //         index: 3,
        //       }
        //     ],
        //   },
        //   {
        //     titile: '场景颜色',
        //     visible: false,
        //     index: 4,
        //     data: [
        //       {
        //         name: "亮度",
        //         value: 1,
        //         isShow: false,
        //         index: 4,
        //       }
        //     ],
        //   },
        // ]
        break
      default:
        break
    }
    return data
  }

  refreshList = section => {
    let newData = this.state.data
    for (let index = 0; index < section.data.length; index++) {
      section.data[index].isShow = !section.data[index].isShow
    }
    section.visible = !section.visible
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  _onValueChange = (value, item, index) => {
    let newData = this.state.data
    newData[item.index].data[index].value = value
    this.setState({
      data: newData.concat(),
    })
  }

  renderListSectionHeader = ({ section }) => {
    let image
    section.visible
      ? (image = require('../../assets/mapEdit/icon_spread.png'))
      : (image = require('../../assets/mapEdit/icon_packUP.png'))
    return (
      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Image source={image} style={styles.selection} />
        <Text style={styles.sectionsTitile}>{section.titile}</Text>
      </TouchableOpacity>
    )
  }
  renderListItem = ({ item, index }) => {
    if (item.isShow) {
      if (typeof item.value === 'boolean') {
        return (
          <View style={styles.row}>
            <Text style={styles.itemName} />
            <Switch
              style={styles.switch}
              onTintColor={'white'}
              tintColor={'white'}
              thumbColor={'#4F4F4F'}
              value={item.value}
              onValueChange={value => {
                this._onValueChange(value, item, index)
              }}
            />
          </View>
        )
      } else {
        return (
          <View style={styles.row}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        )
      }
    } else {
      return <View />
    }
  }

  renderSelection = () => {
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={3}
        type={'MAP_3D'}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '设置',
          navigation: this.props.navigation,
        }}
        bottomBar={this.renderToolBar()}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
