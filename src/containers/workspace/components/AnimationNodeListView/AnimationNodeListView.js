import * as React from 'react'

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SectionList,
} from 'react-native'
import { color } from '../../../../styles'
import { Toast, scaleSize, setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../../containers/NavigationService'

export default class AnimationNodeListView extends React.Component {
  props: {
    type: string,
    data: Array,
    device: Object,
    // showToolbar: () => {},
    // setVisible: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      // data: props.data.data,
      data: props.data,
      type: props.type,
      analystresult: 0,
    }
  }

  componentDidMount() {
    this.getAnimationNodeList()
  }

  getAnimationNodeList = async () => {
    let animationNodeData = await SMap.getAnimationNodeList()
    let subData = []
    subData.push({ name: '动画', index: 0 })
    subData.push({ name: '动画2', index: 1 })
    this.state.data[0].data = animationNodeData
    this.setState({
      data: this.state.data,
    })
  }

  renderListItem = ({ item }) => {
    return (
      // <TouchableOpacity
      //   onPress={() => {
      //     // this.props.setAnimation(item.path)
      //   }}
      //   style={styles.sceneItem}
      // >
      //   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      //     <View style={styles.sceneItemcontent}>
      //       <Text style={[styles.workspaceItem]}>{item.name}</Text>
      //     </View>
      //   </View>
      //   {this.renderItemSeparatorComponent()}
      // </TouchableOpacity>
      <View style={styles.sceneItem}>
        <View style={styles.itemView}>
          <Text style={styles.subTitle}>{item.name}</Text>
          <View style={styles.subView}>
            <TouchableOpacity
              style={styles.subOnpressView}
              onPress={() => this.downMoveItem(item)}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.subOnpressView}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subOnpressView}
              onPress={() => this.upMoveItem(item)}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.subOnpressView}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subOnpressView}
              onPress={() => this.modifyAnimationNodeName(item)}
            >
              <Image
                source={require('../../../../assets/publicTheme/mapTools/layer_rename.png')}
                style={styles.subOnpressView}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subOnpressView}
              onPress={() => this.deleteAnimationNode(item)}
            >
              <Image
                source={require('../../../../assets/mapTools/icon_delete_black.png')}
                style={styles.subOnpressView}
              />
            </TouchableOpacity>
          </View>
        </View>
        {this.renderItemSeparatorComponent()}
      </View>
    )
  }

  downMoveItem = async item => {
    await SMap.moveAnimationNode(item.index, false)
    this.getAnimationNodeList()
  }

  upMoveItem = async item => {
    await SMap.moveAnimationNode(item.index, true)
    this.getAnimationNodeList()
  }

  deleteAnimationNode = async item => {
    SMap.deleteAnimationNode(item.name)
    this.getAnimationNodeList()
  }

  modifyAnimationNodeName = async item => {
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Map_Main_Menu
        .ANIMATION_NODE_NAME,
      //'修改动画节点名称',
      value: item.name,
      placeholder: getLanguage(global.language).Prompt
        .ENTER_ANIMATION_NODE_NAME,
      cb: async value => {
        GLOBAL.Loading &&
          GLOBAL.Loading.setLoading(
            true,
            getLanguage(global.language).Prompt.SAVEING,
          )

        GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
        NavigationService.goBack()

        SMap.modifyAnimationNodeName(item.index, value)
        this.getAnimationNodeList()

        Toast.show(getLanguage(global.language).Prompt.SAVE_SUCCESSFULLY)
      },
    })

    // let resut=SMap.modifyAnimationNodeName(item.index,item.name)
    // this.getAnimationNodeList()
  }

  renderItemSeparatorComponent = () => {
    return (
      <View
        style={[
          styles.Separator,
          {
            width: this.props.device.width,
            // marginLeft: 0.022 * this.props.device.width,
          },
        ]}
      />
    )
  }

  renderListSectionHeader = ({ section }) => {
    return (
      <View style={styles.fltListHeader}>
        <View style={styles.sceneView}>
          {/* <Image
                  source={require('../../../../assets/function/Frenchgrey/icon_symbolFly_white.png')}
                  style={styles.sceneImg}
                /> */}
          <Text style={styles.sceneTitle}>{section.title}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <SectionList
        sections={this.state.data}
        //   sections={this.props.data.data}
        // ItemSeparatorComponent={this.renderItemSeparatorComponent}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        //   SectionSeparatorComponent={this.renderItemSeparatorComponent}
        keyExtractor={(item, index) => index}
      />
    )
  }
}

const styles = StyleSheet.create({
  sceneItem: {
    flex: 1,
    height: scaleSize(81),
    // marginTop: scaleSize(20),
    flexDirection: 'column',
    // justifyContent:"center",
  },
  sceneItemcontent: {
    flex: 1,
    height: scaleSize(80),
    marginLeft: scaleSize(15),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  workspaceItem: {
    padding: scaleSize(5),
    fontSize: setSpText(24),
    paddingLeft: scaleSize(20),
    height: scaleSize(50),
    backgroundColor: color.bgW,
    color: color.themeText2,
  },
  fltListHeader: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
  sceneView: {
    // flex:1,
    height: scaleSize(80),
    flexDirection: 'row',
    // justifyContent:"center",
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
  sceneTitle: {
    fontSize: setSpText(28),
    color: '#FBFBFB',
    paddingLeft: scaleSize(30),
  },
  Separator: {
    flex: 1,
    height: 1,
    // backgroundColor: color.fontColorGray,
    backgroundColor: '#A0A0A0',
  },

  itemView: {
    flexDirection: 'row',
    height: scaleSize(70),
    padding: scaleSize(40),
    alignItems: 'center',
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: setSpText(20),
    height: scaleSize(30),
    color: color.themeText2,
    textAlign: 'center',
    padding: scaleSize(3),
  },
  subView: {
    flexDirection: 'row',
    flex: 1,
    marginRight: scaleSize(20),
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundImage: "url(" + require("../../../../assets/mapEdit/icon-delete-white.png") + ")"
  },
  subOnpressView: {
    height: scaleSize(40),
    width: scaleSize(40),
    marginLeft: scaleSize(10),
  },
})
