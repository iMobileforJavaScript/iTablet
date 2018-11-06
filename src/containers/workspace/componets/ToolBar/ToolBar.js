import React from 'react'
import { scaleSize } from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SectionList,
} from 'react-native'

const list = 'list'
const tabel = 'tabel'

export default class ToolBar extends React.Component {
  props: {
    children: any,
    type: string,
    data: Array,
  }

  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
    }
  }

  showLayers = isShow => {
    this.setState({
      isShow: isShow,
    })
  }

  _onPressButton = () => {
    this.setState({
      isShow: false,
    })
  }

  renderList = () => {
    return (
      <SectionList
        sections={this.props.data}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={item.action}>
              <Text style={styles.item}>{item.title}</Text>
            </TouchableOpacity>
          )
        }}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => index}
      />
    )
  }

  renderTabel = () => {}

  renderView = () => {
    switch (this.props.type) {
      case list:
        return this.renderList()
      case tabel:
        return this.renderTabel()
    }
  }

  render() {
    if (this.state.isShow) {
      return (
        <View style={styles.containers}>
          {this.renderView()}
          <View style={styles.buttonz}>
            <TouchableOpacity
              onPress={this._onPressButton}
              style={styles.button1}
            >
              <Image
                resizeMode={'stretch'}
                source={require('../../../../assets/mapEdit/cancle.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._onPressButton}
              style={styles.button2}
            >
              <Image
                resizeMode={'stretch'}
                source={require('../../../../assets/mapEdit/comit.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  containers: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(600),
    backgroundColor: color.theme,
    zIndex: zIndexLevel.TWO,
  },
  buttonz: {
    flexDirection: 'row',
    height: scaleSize(60),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
  },
  button1: {
    height: scaleSize(60),
  },
  button2: {
    height: scaleSize(60),
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: color.theme,
    color: 'white',
  },
})
