import * as React from 'react'
import styles from './styles'
import {
  View,
  TouchableOpacity,
  Text,
  SectionList,
  FlatList,
} from 'react-native'
export default class Map3DToolBar extends React.Component {
  props: {
    type: string,
    data: Array,
    setfly: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      type: props.type,
    }
  }
  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.setState({
        data: nextProps.data,
      })
    }
  }

  renderListItem = ({ item, index }) => {
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
    if (this.props.type === 'MAP3D_TOOL_FLYLIST') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.setfly(index)
          }}
        >
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
    if (this.props.type === 'MAP3D_TOOL_FLYLIST') {
      return <Text style={styles.sectionHeader}>{section.title}</Text>
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

  renderItem = ({ item }) => {
    // Object.keys(this.state.data).forEach(key=>{
    // attribute.push(
    // <View style={styles.row}>
    // <Text style={styles.name}>{item.name}</Text>
    // <Text style={styles.value}>{item.value}</Text>
    // </View>
    return (
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    )
    //   )
    // })
    // this.state.data.forEach(element => {
    //   attribute.push(
    //     <View>
    //     <Text>{element}</Text>
    //     <Text>{this.state.data[element]}</Text>
    //     </View>
    //   )
    // });
    // return attribute
    //  return (<View style={styles.container}></View>)
  }

  render() {
    if (this.props.type === 'MAP3D_ATTRIBUTE') {
      return (
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index}
        />
      )
    } else {
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
}
