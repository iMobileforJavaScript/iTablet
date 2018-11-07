import React from 'react'
import { scaleSize, screen } from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import { MTBtn } from '../../../../components'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SectionList,
  Animated,
  FlatList,
} from 'react-native'

const list = 'list'
const table = 'table'

export default class ToolBar extends React.Component {
  props: {
    children: any,
    type: string,
    data: Array,
    existFullMap: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      // isShow: false,
      type: props.type,
      isFullContainer: true,
      data: this.getData(props.type),
      bottom: new Animated.Value(-screen.deviceHeight),
    }
    this.isShow = false
  }

  getData = type => {
    let data = []
    switch (type) {
      case 'list':
        break
      case 'table':
        data = [
          {
            key: 'gpsPoint',
            title: 'GPS打点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'gpsPath',
            title: 'GPS轨迹',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        break
    }
    return data
  }

  setVisible = (isShow, type) => {
    if (this.isShow === isShow) return
    if (type && this.state.type !== type) {
      this.setState(
        {
          type: type,
        },
        () => {
          this.showToolbar(isShow)
          !isShow && this.props.existFullMap && this.props.existFullMap()
        },
      )
    } else {
      this.showToolbar(isShow)
      !isShow && this.props.existFullMap && this.props.existFullMap()
    }
    this.isShow = isShow
  }

  showToolbar = isShow => {
    if (this.isShow === isShow) return
    Animated.timing(this.state.bottom, {
      toValue: isShow ? 0 : -screen.deviceHeight,
      duration: 300,
    }).start()
    this.isShow = isShow
  }

  _onPressButton = () => {
    this.setVisible(false)
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

  renderTable = () => {
    return (
      <FlatList
        ref={ref => (this.listView = ref)}
        keyExtractor={(item, index) => index + '-' + item.name}
        data={this.state.data}
        renderItem={this._renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    )
  }

  _renderItem = ({ item, index }) => {
    return (
      <MTBtn
        style={styles.btn}
        key={index}
        title={item.title}
        textColor={'black'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={item.action}
      />
    )
  }

  renderView = () => {
    switch (this.state.type) {
      case list:
        return this.renderList()
      case table:
        return this.renderTable()
    }
  }

  render() {
    let containerStyle = this.state.isFullContainer
      ? styles.fullContainer
      : styles.wrapContainer
    return (
      <Animated.View style={[containerStyle, { bottom: this.state.bottom }]}>
        {this.state.isFullContainer && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setVisible(false)}
            style={styles.overlay}
          />
        )}
        <View style={styles.containers}>
          {/*<View style={{flex: 1}}>*/}
          {this.renderView()}
          {/*</View>*/}
          <View style={styles.buttonz}>
            <TouchableOpacity
              onPress={this._onPressButton}
              style={styles.button}
            >
              <Image
                style={styles.img}
                resizeMode={'contain'}
                source={require('../../../../assets/mapEdit/cancle.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._onPressButton}
              style={styles.button}
            >
              <Image
                style={styles.img}
                resizeMode={'contain'}
                source={require('../../../../assets/mapEdit/comit.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    height: screen.deviceHeight,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  wrapContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: scaleSize(600),
    minHeight: scaleSize(80),
    backgroundColor: color.red,
    // zIndex: zIndexLevel.FOUR,
  },
  buttonz: {
    flexDirection: 'row',
    height: scaleSize(80),
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    height: scaleSize(60),
  },
  img: {
    height: scaleSize(40),
    width: scaleSize(40),
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
