/**
 * 多媒体编辑界面
 */
import * as React from 'react'
import { TouchableOpacity, ScrollView, Image } from 'react-native'
import {
  Container,
  TextBtn,
  ListItem,
  TableList,
  ImageViewer,
} from '../../components'
import { Toast } from '../../utils'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import styles from './styles'
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
    ;(this.info.mediaFilePaths || []).forEach(item => {
      paths.push({
        url: item,
        freeHeight: true,
      })
    })

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
    }
  }

  componentDidMount() {}

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
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.Media,
        )
        await SMediaCollector.saveMedia(
          this.info.layerName,
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
        Toast.show(getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY)
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
    }).then(images => {
      let mediaFilePaths = [...this.state.mediaFilePaths]

      images.forEach(item => {
        mediaFilePaths.push(item.path)
      })
      mediaFilePaths = [...new Set(mediaFilePaths)]

      let paths = []
      mediaFilePaths.forEach(item => {
        paths.push({
          url: item,
          freeHeight: true,
        })
      })

      this.setState({
        mediaFilePaths,
        paths,
      })
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
      <TouchableOpacity
        key={rowIndex + '-' + cellIndex}
        style={item === '+' ? styles.plusImageView : styles.imageView}
        onPress={() => {
          if (item === '+') {
            this.openAlbum()
          } else {
            this.imageViewer &&
              this.imageViewer.setVisible(true, rowIndex * COLUMNS + cellIndex)
          }
        }}
      >
        <Image
          style={styles.image}
          resizeMode={'stretch'}
          source={
            item === '+'
              ? require('../../assets/public/icon-plus.png')
              : { uri: item }
          }
        />
      </TouchableOpacity>
    )
  }

  renderAlbum = () => {
    let data = [...this.state.mediaFilePaths]
    if (this.state.mediaFilePaths.length < 9) {
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

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Prompt.SAVE_YES}
              textStyle={styles.headerBtnTitle}
              btnClick={this.save}
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
        <ImageViewer
          ref={ref => (this.imageViewer = ref)}
          imageUrls={this.state.paths}
        />
      </Container>
    )
  }
}
