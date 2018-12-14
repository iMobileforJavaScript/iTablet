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
import { SScene } from 'imobile_for_reactnative'

export default class setting extends Component {
  props: {
    navigation: Object,
    data: Array,
  }
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params.type || 'MAP_3D'
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    if (this.type === 'MAP_3D') {
      this.getMap3DSettings()
    }
  }
  getMap3DSettings = async () => {
    let item = await SScene.getSetting()
    let data = [
      {
        titile: '基本设置',
        visible: true,
        index: 0,
        data: [
          {
            name: '场景名称',
            value: item.sceneNmae,
            isShow: true,
            index: 0,
          },
          {
            name: '相机角度',
            value: item.heading,
            isShow: true,
            index: 0,
          },
          {
            name: '视图模式',
            value: '球面',
            isShow: true,
            index: 0,
          },
          {
            name: '地形缩放比例',
            value: 1,
            isShow: true,
            index: 0,
          },
        ],
      },
    ]
    this.setState({ data: data })
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
        type={this.type}
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
