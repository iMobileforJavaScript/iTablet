import * as React from 'react'
import styles from './styles'
import { View, TouchableOpacity, Text, SectionList } from 'react-native'
export default class Map3DToolBar extends React.Component {
  props: {
    type: String,
    data: Array,
  }
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      type: props.type,
    }
  }

  renderListItem = ({ item }) => {
    if (this.props.type === 'MAP3D_BASE') {
      if (item.show) {
        return (
          <TouchableOpacity>
            <Text style={styles.item}>{item.title}</Text>
          </TouchableOpacity>
        )
      } else {
        return <View />
      }
    }
    if (this.props.type === 'MAP3D_ADD_LAYER') {
      return (
        <TouchableOpacity>
          <Text style={styles.item}>{item.title}</Text>
        </TouchableOpacity>
      )
    }
    return <View />
  }

  renderListSectionHeader = ({ section }) => {
    if (this.props.type === 'MAP3D_BASE') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.refreshList(section)
          }}
        >
          <Text style={styles.sectionHeader}>{section.title}</Text>
        </TouchableOpacity>
      )
    }
    if (this.props.type === 'MAP3D_ADD_LAYER') {
      return <View />
    }
  }

  renderItemSeparatorComponent = () => {
    return <View style={styles.Separator} />
  }
  refreshList = section => {
    let newData = this.state.data
    for (let index = 0; index < section.data.length; index++) {
      section.data[index].show = !section.data[index].show
    }
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  render() {
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        SectionSeparatorComponent={this.renderItemSeparatorComponent}
        keyExtractor={(item, index) => index}
      />
    )
  }
}
