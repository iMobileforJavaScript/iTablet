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
  }
  constructor(props) {
    super(props)
  }

  renderListSectionHeader = ({ section }) => {
    let image
    //    this.state.first? image=require("") :image=require("")
    return (
      <TouchableOpacity>
        <Image source={image} style={styles.section} />
        <Text style={styles.sectionsTitile}>{section.titile}</Text>
      </TouchableOpacity>
    )
  }

  renderListItem = ({ item }) => {
    if (item.type === '') {
      return (
        <TouchableOpacity>
          <Text />
          <Switch
            onTintColor={'red'}
            tintColor={'blue'}
            thumbColor={'black'}
            value={false}
          />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.row}>
          <Text>{item.name}</Text>
          <Text>{item.value}</Text>
        </View>
      )
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
        initIndex={2}
        type={'MAP_3D'}
      />
    )
  }

  render() {
    return (
      <Container
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
