import React, { Component } from 'react'
import { ScrollView, FlatList } from 'react-native'
import { Container } from '../../../../components'
import TouchableItemView from '../TouchableItemView'
import ConstModule from '../../../../constants/ConstModule'
import { getLanguage } from '../../../../language/index'

export default class SelectModule extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.callBack = this.props.navigation.getParam('callBack')
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Friends.SELECT_MODULE,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <ScrollView>
          <FlatList
            data={ConstModule(global.language)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableItemView
                item={{
                  // image: item.moduleImage,
                  text: item.title,
                }}
                onPress={() => {
                  this.callBack && this.callBack(item)
                }}
              />
            )}
          />
        </ScrollView>
      </Container>
    )
  }
}
