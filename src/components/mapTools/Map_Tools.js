import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import * as Util from '../../utils/constUtil'
import PropTypes from 'prop-types'
import MT_Btn from './MT_Btn'

const WIDTH = Util.WIDTH
const ITEM_HEIGHT = 0.75 * 1.4 * 0.1 * WIDTH
const ITEM_WIDTH = ITEM_HEIGHT
const BORDERCOLOR = Util.USUAL_SEPARATORCOLOR
let show = false
let type = ''

export default class Map_Tools extends React.Component {
  static propTypes = {
    POP_List: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      data: [
        {
          key: '新建图层',
          image: require('../../assets/public/add_layer.png'),
          btnClick: this._addLayer,
        },
        {
          key: '数据采集',
          image: require('../../assets/public/data_collect.png'),
          btnClick: () => {},
        },
        {
          key: '数据编辑',
          image: require('../../assets/public/data_edit.png'),
          btnClick: () => {},
        },
        {
          key: '地图管理',
          image: require('../../assets/public/map_manager.png'),
          btnClick: () => {},
        },
        {
          key: '数据管理',
          image: require('../../assets/public/data_manager.png'),
          btnClick: () => {},
        },
        {
          key: '数据分析',
          image: require('../../assets/public/analyst.png'),
          btnClick: this._analyst,
        },
        {
          key: '工具',
          image: require('../../assets/public/tools.png'),
          btnClick: this._tools,
        },
      ],
    }
  }
  _addLayer = () => {
    show = !show
    type = 'add_layer'
    this.props.POP_List && this.props.POP_List(show, type)
  }

  _analyst = () => {
    show = !show
    type = 'analyst'
    this.props.POP_List && this.props.POP_List(show, type)
  }

  _tools = () => {
    show = !show
    type = 'tools'
    this.props.POP_List && this.props.POP_List(show, type)
  }

  _renderItem = ({ item }) => {
    let key = item.key
    let image = item.image
    let btnClick = item.btnClick
    let width =
      ITEM_WIDTH < WIDTH / this.state.data.length
        ? WIDTH / this.state.data.length
        : ITEM_WIDTH
    return (
      <View style={[styles.item, { width: width }]}>
        <MT_Btn title={key} image={image} btnClick={btnClick} />
      </View>
    )
  }

  render() {
    const data = this.state.data
    // let width = (WIDTH < ITEM_WIDTH * this.state.length) ? ITEM_WIDTH * this.state.length : WIDTH
    return (
      <View style={styles.container}>
        <FlatList data={data} renderItem={this._renderItem} horizontal={true} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
    width: ITEM_WIDTH,
  },
  container: {
    height: ITEM_HEIGHT + 5,
    width: WIDTH,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: BORDERCOLOR,
    borderTopWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
})
