import React, { Component } from 'react'
import { Container } from '../../components'
import { MapToolbar } from '../../containers/workspace/components'
import {
  View,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  Switch,
} from 'react-native'
import styles from './styles'
import settingData from './settingData'
export default class setting extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
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
    this.getdata()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.settingData) !==
      JSON.stringify(this.props.settingData)
    ) {
      this.setState({ data: this.props.settingData })
    }
  }

  getdata = async () => {
    let data
    if (this.type === 'MAP_3D') {
      // eslint-disable-next-line
      data = await settingData.getMap3DSettings()
    }
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
        <Text style={styles.sectionsTitle}>{section.title}</Text>
      </TouchableOpacity>
    )
  }
  renderListItem = ({ item, index }) => {
    let itemSeparator = true
    if (this.state.data[item.index].data.length - 1 === index) {
      itemSeparator = false
    }
    if (item.isShow) {
      if (typeof item.value === 'boolean') {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.switchText}>{item.name}</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: 'white', true: '#505050' }}
                thumbColor={item.value ? 'white' : '#505050'}
                value={item.value}
                onValueChange={value => {
                  this._onValueChange(value, item, index)
                }}
              />
            </View>
            {itemSeparator ? (
              <View
                style={[
                  styles.itemSeparator,
                  {
                    width: 0.956 * this.props.device.width,
                    marginLeft: 0.022 * this.props.device.width,
                  },
                ]}
              />
            ) : (
              <View />
            )}
          </View>
        )
      } else {
        return (
          <View>
            <View style={styles.row}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
            {itemSeparator ? (
              <View
                style={[
                  styles.itemSeparator,
                  {
                    width: 0.956 * this.props.device.width,
                    marginLeft: 0.022 * this.props.device.width,
                  },
                ]}
              />
            ) : (
              <View />
            )}
          </View>
        )
      }
    } else {
      return <View />
    }
  }
  _renderItemSeparator = () => {
    return <View style={styles.itemSeparator} />
  }
  renderSelection = () => {
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        // ItemSeparatorComponent={this._renderItemSeparator}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
        onRefresh={this.getdata}
        refreshing={false}
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
          withoutBack: true,
        }}
        bottomBar={this.renderToolBar()}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
