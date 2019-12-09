import * as React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import NavigationService from '../../../containers/NavigationService' //导航模块
import { BtnOne } from '../../../components'
import { scaleSize } from '../../../utils'
const icon_workspace = require('../../../assets/MapLoad/icon-open-workspace.png')
const icon_udb = require('../../../assets/MapLoad/icon-opne-udb.png')
// const icon_webudb = require('../../../assets/MapLoad/icon-open-webudb.png')
const icon_newudb = require('../../../assets/MapLoad/icon-new-datasource.png')
const width = Dimensions.get('window').width
const testData = [
  { key: '打开文件型工作空间' },
  { key: '打开文件型数据源' },
  { key: '打开web型数据源' },
  { key: '新建文件型数据源' },
]

// class Item extends React.Component {
//
//   props: {
//     onPress: () => {},
//     text: string,
//   }
//
//   action = () => {
//     this.props.onPress && this.props.onPress()
//   }
//
//   render() {
//     return (
//       <View>
//         <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={this.action} >
//           <View style={styles.item}><Text style={{ fontSize: 18 }}>{this.props.text ? this.props.text : 'item'}</Text></View>
//         </TouchableOpacity>
//         <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#bbbbbb' }} />
//       </View>
//     )
//   }
// }

export default class OffLineList extends React.Component {
  props: {
    Workspace: any,
    map: any,
    mapControl: any,
    cb: any,
  }

  constructor(props) {
    super(props)
    this.workspace = this.props.Workspace
    this.map = this.props.map
    this.mapControl = this.props.mapControl
  }

  _btn_workspace_click = () => {
    if (this.workspace) {
      NavigationService.navigate('WorkspaceFileList', {
        workspace: this.workspace,
        map: this.map,
        mapControl: this.mapControl,
        need: 'workspace',
        title: '选择工作空间',
      })
    } else {
      NavigationService.navigate('WorkspaceFileList', {
        need: 'workspace',
        title: '选择工作空间',
      })
    }
  }

  _btn_udb_click = () => {
    if (this.workspace) {
      NavigationService.navigate('WorkspaceFileList', {
        workspace: this.workspace,
        map: this.map,
        mapControl: this.mapControl,
        need: 'udb',
        title: '选择数据源',
      })
    } else {
      NavigationService.navigate('WorkspaceFileList', {
        need: 'udb',
        title: '选择数据源',
      })
    }
  }

  _btn_web_click = () => {
    if (this.workspace) {
      NavigationService.navigate('webUdb', {
        workspace: this.workspace,
        map: this.map,
        mapControl: this.mapControl,
        need: 'webudb',
      })
    } else {
      NavigationService.navigate('webUdb', { need: 'webudb' })
    }
  }

  _btn_newudb_click = () => {
    if (this.workspace) {
      NavigationService.navigate('NewDSource', {
        workspace: this.workspace,
        map: this.map,
        mapControl: this.mapControl,
        need: 'newudb',
      })
    } else {
      NavigationService.navigate('NewDSource', {
        workspace: this.workspace,
        need: 'newudb',
      })
    }
  }

  _addElement = (delegate, src, str) => {
    if (typeof delegate === 'function' && typeof str === 'string') {
      let element = (
        <BtnOne
          onPress={delegate}
          image={src}
          title={str}
          titleStyle={styles.btntop}
        />
      )
      return element
    } else {
      return <View style={styles.item} />
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._addElement(
          this._btn_workspace_click,
          icon_workspace,
          testData[0].key,
        )}
        {this._addElement(this._btn_udb_click, icon_udb, testData[1].key)}
        {/*{this._addElement(this._btn_web_click, icon_webudb, testData[2].key)}*/}
        {this._addElement(this._btn_newudb_click, icon_newudb, testData[3].key)}
        {/* {this._addElement()} */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    width: scaleSize(120),
  },
  container: {
    width: 0.9 * width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    paddingTop: 5,
    height: 105,
    // backgroundColor:'white'
  },
  btntop: {
    width: 0.15 * width,
    marginTop: scaleSize(10),
  },
})
