import React, { Component } from 'react'
import { Container } from '../../components'
import { MAP_MODULE } from '../../constants'
import constants from '../workspace/constants'
import { MapToolbar } from '../workspace/componets'
import { SectionList } from 'react-native'
import styles from './styles'
import { getMapSettings } from './settingData'
import SettingSection from './SettingSection'
import SettingItem from './SettingItem'

export default class MapSetting extends Component {
  props: {
    navigation: Object,
    data: Array,
    setMapSetting: () => {},
    mapSetting: any,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.state = {
      data: getMapSettings(),
    }
  }

  componentDidMount() {
    // this.getData()
  }

  // componentDidUpdate(prevProps) {
  //   if (
  //     JSON.stringify(prevProps.mapSetting) !==
  //     JSON.stringify(this.props.mapSetting)
  //   ) {
  //     this.setState({ data: this.props.mapSetting })
  //   }
  // }

  getData = async () => {
    this.setState({ data: getMapSettings() })
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

  _onValueChange = ({ value, item, index }) => {
    let newData = this.state.data
    newData[item.sectionIndex].data[index].value = value
    this.setState({
      data: newData.concat(),
    })
  }

  renderListSectionHeader = ({ section }) => {
    return (
      <SettingSection data={section} onPress={data => this.refreshList(data)} />
    )
  }

  renderListItem = ({ item, index }) => {
    return (
      <SettingItem
        data={item}
        index={index}
        onPress={data => this._onValueChange(data)}
      />
    )
  }

  renderSelection = () => {
    if (this.state.data.length === 0) return
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
        onRefresh={this.getData}
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
    let title = ''
    switch (GLOBAL.Type) {
      case constants.COLLECTION:
        title = MAP_MODULE.MAP_COLLECTION
        break
      case constants.MAP_EDIT:
        title = MAP_MODULE.MAP_EDIT
        break
      case constants.MAP_3D:
        title = MAP_MODULE.MAP_3D
        break
      case constants.MAP_THEME:
        title = MAP_MODULE.MAP_THEME
        break
    }
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: title,
          navigation: this.props.navigation,
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
