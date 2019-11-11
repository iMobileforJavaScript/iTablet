import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  Platform,
} from 'react-native'
import { Container, EmptyView, TextBtn } from '../../components'
import { FileTools } from '../../native'
import { Toast, scaleSize, setSpText } from '../../utils'
import { ConstPath } from '../../constants'

import { color } from '../../styles'
import { Btnone, UploadDialog } from './component'
export default class UpLoadList extends Component {
  props: {
    title: string,
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    this.path = ConstPath.LocalDataPath
    this.state = {
      data: [],
      backPath: '',
      showData: false,
      uploadlist: {},
    }
  }

  componentDidMount() {
    (async function() {
      try {
        this.container.setLoading(true)
        let exist = await FileTools.fileIsExistInHomeDirectory(
          ConstPath.LocalDataPath,
        )
        if (!exist) {
          this.setState(
            {
              showData: true,
            },
            () => {
              this.container.setLoading(false)
            },
          )
        } else {
          this.getFileList({ path: this.path })
        }
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
  }

  getFileList = item => {
    (async function() {
      try {
        let absolutePath = await FileTools.appendingHomeDirectory(item.path)
        let isDirectory = await FileTools.isDirectory(absolutePath)
        if (!isDirectory) {
          return
        } else {
          let filter = 'sxmu,smwu,udb'
          let fileList = await FileTools.getPathListByFilter(absolutePath, {
            extension: filter,
          })
          this.setState({
            data: fileList,
            backPath: item.path,
            showData: true,
          })
          this.container.setLoading(false)
        }
      } catch (e) {
        this.container.setLoading(true)
      }
    }.bind(this)())
  }

  refeshUpLoadList = async item => {
    let datalist = this.state.uploadlist
    if (datalist[item.name]) {
      delete datalist[item.name]
    } else {
      datalist[item.name] = item.path
    }
    this.setState({
      uploadlist: datalist,
    })
  }

  addupload = async () => {
    JSON.stringify(this.state.uploadlist) !== '{}'
      ? this.uploadDialog.setDialogVisible(true)
      : Toast.show('请选择要上传的文件')
  }
  _toBack = async () => {
    let backPath = this.state.backPath.substr(
      0,
      this.state.backPath.lastIndexOf(
        '/',
        this.state.backPath.lastIndexOf('/'),
      ),
    )
    await this.getFileList({ path: backPath })
  }

  headerBack = () => {
    let isRootPath =
      Platform.OS === 'android'
        ? false
        : this.state.backPath === ConstPath.AppPath
    if (this.state.backPath === '' || isRootPath) {
      return null
    } else {
      return (
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => this._toBack()}
        >
          <Text style={styles.back}>返回上一层目录</Text>
          <Text style={styles.back}>{this.state.backPath}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderItem = ({ item }) => {
    let image = item.isDirectory
      ? require('../../assets/public/icon-files.png')
      : require('../../assets/public/icon-file.png')
    return (
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.getFileList(item)}
          style={styles.btn}
        >
          <View style={styles.imgView}>
            <Image source={image} style={styles.img} />
          </View>
          <Text numberOfLines={1} style={styles.item}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <Btnone style={styles.select} cb={() => this.refeshUpLoadList(item)} />
      </View>
    )
  }

  itemSeparator = () => {
    return <View style={styles.itemSeparator} />
  }

  _keyExtractor = item => {
    return item.path
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        initWithLoading
        headerProps={{
          title: '上传文件',
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText="添加"
              textStyle={styles.headerBtnTitle}
              btnClick={this.addupload}
            />
          ),
        }}
      >
        {this.headerBack()}
        {this.state.showData &&
          (this.state.data.length > 0 ? (
            <FlatList
              ItemSeparatorComponent={this.itemSeparator}
              style={styles.container}
              data={this.state.data}
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
            />
          ) : (
            <EmptyView />
          ))}
        <UploadDialog
          ref={ref => (this.uploadDialog = ref)}
          data={this.state.uploadlist}
          confirmBtnTitle={'上传'}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background2,
  },
  item: {
    marginLeft: scaleSize(30),
    fontSize: setSpText(30),
  },
  back: {
    fontSize: setSpText(30),
    color: '#1296db',
    paddingTop: scaleSize(30),
    paddingBottom: scaleSize(30),
    height: scaleSize(100),
  },
  row: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: color.background3,
    borderWidth: scaleSize(2),
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleSize(30),
  },
  imgView: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  itemSeparator: {
    height: scaleSize(6),
  },
  headerBack: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: 17,
  },
  select: {
    width: scaleSize(150),
    height: scaleSize(60),
  },
})
