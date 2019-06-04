/**
 * 多媒体编辑界面
 */
import * as React from 'react'
import { ScrollView, TouchableOpacity, Text } from 'react-native'
import {
  Container,
  TextBtn,
  ListItem,
  TableList,
  MediaViewer,
  PopModal,
} from '../../components'
import { Toast, checkType } from '../../utils'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import styles from './styles'
import MediaItem from './MediaItem'
import { getLanguage } from '../../language'
import NavigationService from '../../containers/NavigationService'
import ImagePicker from 'react-native-image-crop-picker'
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
    let paths = []

    this.showInfo = {
      mediaFileName: this.info.mediaFileName || '',
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

  dealData = async (mediaPaths = []) => {
    let paths = []
    for (let item of mediaPaths) {
      const type = checkType.getMediaTypeByPath(item)
      let info
      if (type === 'video') {
        let path = item.replace('file://', '')
        info = await SMediaCollector.getVideoInfo(path)
      }
      paths.push({
        ...info,
        uri: item,
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
          // this.info.layerName,
          GLOBAL.TaggingDatasetName,
          this.info.geoID,
          targetPath,
          modifiedData,
        )
        // await SMap.setLayerFieldInfo(
        //   this.info.layerName,
        //   modifiedData,
        //   {
        //     filter: `SmID=${this.info.geoID}`,
        //   },
        // )
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
    ImagePicker.openPicker({
      multiple: true,
      maxFiles,
    }).then(this.addMediaFiles)
  }

  addMediaFiles = async (images = []) => {
    let mediaFilePaths = [...this.state.mediaFilePaths]

    images.forEach(item => {
      if (typeof item === 'string') {
        mediaFilePaths.push(item)
      } else {
        mediaFilePaths.push(item.path)
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
        onPress={() => {
          if (item === '+') {
            // this.openAlbum()
            this.popModal && this.popModal.setVisible(true)
          } else {
            // this.imageViewer &&
            //   this.imageViewer.setVisible(true, rowIndex * COLUMNS + cellIndex)
            const itemInfo = this.state.paths[rowIndex * COLUMNS + cellIndex]
            this.mediaViewer && this.mediaViewer.setVisible(true, itemInfo.uri)
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
      <PopModal ref={ref => (this.popModal = ref)}>
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
                setTimeout(() => this.openAlbum(), 1000)
              })
          }}
        >
          <Text style={styles.popText}>
            {getLanguage(this.props.language).Map_Tools.FROM_ALBUM}
          </Text>
        </TouchableOpacity>
      </PopModal>
    )
  }

  render() {
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
            value: this.state.mediaFileName,
            type: 'arrow',
            action: () => {
              NavigationService.navigate('InputPage', {
                value: this.state.mediaFileName,
                headerTitle: getLanguage(global.language).Map_Label.NAME,
                cb: async value => {
                  this.setState({
                    mediaFileName: value,
                  })
                  NavigationService.goBack()
                },
              })
            },
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.COORDINATE,
            value: this.state.coordinate.x + ',' + this.state.coordinate.y,
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
        <MediaViewer
          ref={ref => (this.mediaViewer = ref)}
          withBackBtn
          isModal
        />
      </Container>
    )
  }
}
