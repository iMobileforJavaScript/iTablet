/**
 * 多媒体编辑界面
 */
import * as React from 'react'
import { ScrollView, TouchableOpacity, Text, Platform } from 'react-native'
import {
  Container,
  TextBtn,
  ListItem,
  TableList,
  MediaPager,
  PopView,
  ImagePicker,
} from '../../components'
import { Toast, checkType } from '../../utils'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import styles from './styles'
import MediaItem from './MediaItem'
import { getLanguage } from '../../language'
import NavigationService from '../../containers/NavigationService'
// import ImagePicker from 'react-native-image-crop-picker'
import { SMediaCollector } from 'imobile_for_reactnative'

const COLUMNS = 3
const MAX_FILES = 9

export default class MediaEdit extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.info = (params && params.info) || {}
    this.cb = (params && params.cb) || {}
    let paths = []

    this.showInfo = {
      mediaName: this.info.mediaName || '',
      coordinate: this.info.coordinate || '',
      modifiedDate: this.info.modifiedDate || '',
      description: this.info.description || '',
      httpAddress: this.info.httpAddress || '',
      mediaFilePaths: this.info.mediaFilePaths || [],
    }
    this.state = {
      ...this.showInfo,
      paths,
      showDelete: false,
    }
    this.mediaItemRef = []
  }

  componentDidMount() {
    (async function() {
      let paths = await this.dealData(this.state.mediaFilePaths)
      this.setState({
        paths,
      })
    }.bind(this)())
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(nextProps.user) !== JSON.stringify(this.props.user) ||
      nextProps.language !== this.props.language ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    return shouldUpdate
  }

  dealData = async (mediaPaths = []) => {
    let paths = []
    for (let item of mediaPaths) {
      const type = checkType.getMediaTypeByPath(item)
      let info,
        path = item
      if (type === 'video') {
        if (item.indexOf('file://') === 0) {
          path = item.replace('file://', '')
          // item = path
        } else if (item.indexOf('/iTablet') === 0) {
          path = await FileTools.appendingHomeDirectory(item)
        }
        info = await SMediaCollector.getVideoInfo(path)
      } else if (item.indexOf('/iTablet') === 0) {
        // 判断是否是已存的图片
        path = await FileTools.appendingHomeDirectory(item)
      }
      paths.push({
        ...info,
        uri: path,
        type,
      })
    }
    return paths
  }

  save = () => {
    if (!this.info.layerName) {
      return
    }
    (async function() {
      try {
        let modifiedData = []
        for (let key in this.info) {
          if (this.showInfo[key] !== this.state[key]) {
            modifiedData.push({
              name: key,
              value: this.state[key],
            })
          }
        }
        if (modifiedData.length === 0) {
          Toast.show(getLanguage(this.props.language).Prompt.NO_NEED_TO_SAVE)
          return
        }
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.Media,
        )
        let result = await SMediaCollector.saveMediaByDataset(
          GLOBAL.TaggingDatasetName || this.info.layerName,
          this.info.geoID,
          targetPath,
          modifiedData,
          this.info.addToMap !== undefined ? this.info.addToMap : true,
        )
        if (
          result &&
          Object.keys(modifiedData).length > 0 &&
          typeof this.cb === 'function'
        ) {
          this.cb(modifiedData)
        }
        Toast.show(
          result
            ? getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
            : getLanguage(this.props.language).Prompt.SAVE_FAILED,
        )
      } catch (e) {
        Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
      }
    }.bind(this)())
  }

  openAlbum = () => {
    let maxFiles = MAX_FILES - this.state.mediaFilePaths.length
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: maxFiles,
      callback: async data => {
        if (data.length > 0) {
          this.addMediaFiles(data)
        }
      },
    })
  }

  addMediaFiles = async (images = []) => {
    let mediaFilePaths = [...this.state.mediaFilePaths]

    images.forEach(item => {
      let path
      if (typeof item === 'string') {
        path = item
        if (item.indexOf('file://') === 0) {
          path = item.replace('file://', '')
        }
        mediaFilePaths.push(path)
      } else {
        path = item.path || item.uri
        if (path.indexOf('file://') === 0) {
          path = path.replace('file://', '')
        }
        mediaFilePaths.push(path)
      }
    })
    mediaFilePaths = [...new Set(mediaFilePaths)]

    let paths = await this.dealData(mediaFilePaths)

    this.mediaItemRef = []
    this.setState({
      mediaFilePaths,
      paths,
    })
  }

  deleteMediaFile = async index => {
    if (index >= this.state.mediaFilePaths.length) return
    let mediaFilePaths = [...this.state.mediaFilePaths]

    mediaFilePaths.splice(index, 1)

    let paths = await this.dealData(mediaFilePaths)

    this.mediaItemRef = []
    this.setState({
      mediaFilePaths,
      paths,
    })
  }

  renderItem = ({ title, type, action, value }) => {
    return (
      <ListItem
        key={title}
        title={title}
        value={value}
        type={type}
        onPress={action}
      />
    )
  }

  renderImage = ({ item, rowIndex, cellIndex }) => {
    return (
      <MediaItem
        ref={ref => {
          if (ref && ref.props.data !== '+') {
            this.mediaItemRef[rowIndex * COLUMNS + cellIndex] = ref
          }
        }}
        data={item}
        index={rowIndex * COLUMNS + cellIndex}
        onPress={({ data, index }) => {
          if (data === '+') {
            // this.openAlbum()
            this.popModal && this.popModal.setVisible(true)
          } else {
            // this.imageViewer &&
            //   this.imageViewer.setVisible(true, rowIndex * COLUMNS + cellIndex)
            const itemInfo = this.state.paths[rowIndex * COLUMNS + cellIndex]
            let imgPath = itemInfo.uri
            if (
              Platform.OS === 'android' &&
              imgPath.toLowerCase().indexOf('content://') !== 0
            ) {
              imgPath = 'file://' + imgPath
            }
            // this.mediaViewer && this.mediaViewer.setVisible(true, imgPath)
            this.mediaViewer && this.mediaViewer.setVisible(true, index)
            // this.mediaViewer.setVisible(true, this.state.mediaFilePaths[rowIndex * COLUMNS + cellIndex])
          }
        }}
        onDeletePress={item => {
          this.deleteMediaFile(item.index)
        }}
        onLongPress={() => {
          for (let ref of this.mediaItemRef) {
            if (ref.props.data !== '+') ref.setDelete && ref.setDelete(true)
          }
          this.setState({
            showDelete: true,
          })
        }}
      />
    )
  }

  renderAlbum = () => {
    let data = [...this.state.paths]
    if (!this.state.showDelete && this.state.paths.length < 9) {
      data.push('+')
    }
    return (
      <TableList
        style={[styles.tableView, { width: '100%' }]}
        cellStyle={styles.tableCellView}
        rowStyle={styles.tableRowStyle}
        lineSeparator={20}
        numColumns={3}
        data={data}
        renderCell={this.renderImage}
      />
    )
  }

  renderPopView = () => {
    return (
      <PopView ref={ref => (this.popModal = ref)}>
        <TouchableOpacity
          style={[styles.popBtn, { width: '100%' }]}
          onPress={() => {
            this.popModal && this.popModal.setVisible(false)
            NavigationService.navigate('Camera', {
              limit: MAX_FILES - this.state.mediaFilePaths.length,
              cb: this.addMediaFiles,
            })
          }}
        >
          <Text style={styles.popText}>
            {getLanguage(this.props.language).Map_Tools.TAKE_PHOTO}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.popBtn, { width: '100%' }]}
          onPress={() => {
            this.popModal &&
              this.popModal.setVisible(false, () => {
                this.openAlbum()
              })
          }}
        >
          <Text style={styles.popText}>
            {getLanguage(this.props.language).Map_Tools.FROM_ALBUM}
          </Text>
        </TouchableOpacity>
      </PopView>
    )
  }

  render() {
    let coordinate =
      this.state.coordinate.x !== undefined &&
      this.state.coordinate.y !== undefined
        ? this.state.coordinate.x.toFixed(6) +
          ',' +
          this.state.coordinate.y.toFixed(6)
        : ''
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={
                this.state.showDelete
                  ? getLanguage(this.props.language).Prompt.COMPLETE
                  : getLanguage(this.props.language).Prompt.SAVE_YES
              }
              textStyle={styles.headerBtnTitle}
              btnClick={() => {
                if (this.state.showDelete) {
                  for (let ref of this.mediaItemRef) {
                    if (ref && ref.props.data !== '+')
                      ref.setDelete && ref.setDelete(false)
                  }
                  this.setState({
                    showDelete: false,
                  })
                } else {
                  this.save()
                }
              }}
            />
          ),
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Label.NAME,
            value: this.state.mediaName,
            type: 'arrow',
            action: () => {
              NavigationService.navigate('InputPage', {
                value: this.state.mediaName,
                headerTitle: getLanguage(global.language).Map_Label.NAME,
                type: 'name',
                cb: async value => {
                  this.setState({
                    mediaName: value,
                  })
                  NavigationService.goBack()
                },
              })
            },
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.COORDINATE,
            value: coordinate,
            type: 'arrow',
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.COLLECT_TIME,
            value: this.state.modifiedDate,
            type: 'arrow',
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS_HTTP,
            value: this.state.httpAddress,
            type: 'arrow',
            action: () => {
              NavigationService.navigate('InputPage', {
                value: this.state.httpAddress,
                headerTitle: getLanguage(global.language).Map_Main_Menu
                  .TOOLS_HTTP,
                type: 'http',
                cb: async value => {
                  this.setState({
                    httpAddress: value,
                  })
                  NavigationService.goBack()
                },
              })
            },
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS_REMARKS,
            value: this.state.description,
            type: 'arrow',
            action: () => {
              NavigationService.navigate('InputPage', {
                value: this.state.description,
                headerTitle: getLanguage(global.language).Map_Main_Menu
                  .TOOLS_REMARKS,
                cb: async value => {
                  this.setState({
                    description: value,
                  })
                  NavigationService.goBack()
                },
              })
            },
          })}
          {this.renderAlbum()}
        </ScrollView>
        {this.renderPopView()}
        {/*<MediaViewer*/}
        {/*ref={ref => (this.mediaViewer = ref)}*/}
        {/*withBackBtn*/}
        {/*isModal*/}
        {/*/>*/}
        <MediaPager
          ref={ref => (this.mediaViewer = ref)}
          data={this.state.paths}
          withBackBtn
          isModal
        />
      </Container>
    )
  }
}
