import React from 'react'
import {
  CameraRoll,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import PageKeys from './PageKeys'
import Container from '../../Container'
import { InputDialog } from '../../Dialog'
import { getLanguage } from '../../../language'
import { scaleSize } from '../../../utils'
import { size } from '../../../styles'
import { FileTools } from '../../../native'
import { ConstPath } from '../../../constants'

export default class extends React.PureComponent {
  props: {
    maxSize: number,
    autoConvertPath: boolean,
    assetType: String,
    groupTypes: String,
    choosePhotoTitle: String,
    cancelLabel: String,
    callback: String,
    navigation: Object,
    showDialog?: boolean,

    callback: () => {},
    dialogConfirm?: () => {},
    dialogCancel?: () => {},
  }

  static defaultProps = {
    maxSize: 1,
    autoConvertPath: false,
    assetType: 'Photos',
    groupTypes: 'All',
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedItems: [],
    }
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this._onWindowChanged)
    ;(async function() {
      if (this.props.showDialog && this.dialog)
        this.dialog.setDialogVisible(this.props.showDialog)
      let data

      let homePath = await FileTools.appendingHomeDirectory()
      let imgPath = homePath + ConstPath.Images
      let images = await FileTools.getPathListByFilterDeep(
        imgPath,
        'png, jpg, jpeg',
      )
      images.map(item => {
        item.filename = item.name
        item.uri = item.path
        delete item.name
        delete item.path
      })
      if (Platform.OS === 'android' && this.props.assetType === 'All') {
        let photots = await this.getPhotos('Photos')
        let videos = await this.getPhotos('Videos')

        data = JSON.parse(JSON.stringify(videos))
        photots.forEach((photoDir, index) => {
          let exist = false
          for (let i = 0; i < videos.length; i++) {
            if (photoDir.name === videos[i].name) {
              exist = true
              data[index].value = data[index].value.concat(photoDir.value)
              data[index].value.sort((a, b) => b - a)
              break
            }
          }
          if (!exist) {
            data.push(photoDir)
          }
        })
      } else {
        data = await this.getPhotos(this.props.assetType)
      }
      data.unshift({
        name: 'iTablet',
        value: images,
      })
      this.setState({ data })
    }.bind(this)())
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._onWindowChanged)
  }

  render() {
    // const safeArea = getSafeAreaInset()
    // const style = {
    //   paddingLeft: safeArea.left,
    //   paddingRight: safeArea.right,
    //   paddingBottom: safeArea.bottom,
    // }
    return (
      <Container
        style={styles.view}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          withoutBack: true,
          headerRight: [
            <TouchableOpacity key={'addImage'} onPress={this._clickCancel}>
              <Text style={styles.headerRight}>
                {getLanguage(GLOBAL.language).Analyst_Labels.CANCEL}
              </Text>
            </TouchableOpacity>,
          ],
        }}
      >
        {/*<NaviBar*/}
        {/*title={this.props.choosePhotoTitle}*/}
        {/*leftElement={[]}*/}
        {/*rightElement={this.props.cancelLabel}*/}
        {/*onRight={this._clickCancel}*/}
        {/*/>*/}
        <FlatList
          style={[styles.listView]}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={item => item.name}
          extraData={this.state}
        />
        {this.props.dialogConfirm && (
          <InputDialog
            ref={ref => (this.dialog = ref)}
            title={getLanguage(GLOBAL.language).Map_Main_Menu.TOUR_NAME}
            confirmAction={value => {
              this.props.dialogConfirm(value, () =>
                this.dialog.setDialogVisible(false),
              )
            }}
            cancelAction={() => {
              if (this.props.dialogCancel) {
                this.props.dialogCancel()
              } else {
                this._clickCancel()
              }
            }}
            confirmBtnTitle={getLanguage(GLOBAL.language).Map_Settings.CONFIRM}
            cancelBtnTitle={getLanguage(GLOBAL.language).Map_Settings.CANCEL}
          />
        )}
      </Container>
    )
  }

  _renderItem = ({ item }) => {
    const itemUris = new Set(item.value.map(i => i.uri))
    const selectedItems = this.state.selectedItems.filter(i =>
      itemUris.has(i.uri),
    )
    const selectedCount = selectedItems.length
    let uri =
      (Platform.OS === 'android' &&
      item.value[0].uri.indexOf('file://') === -1 &&
      item.value[0].uri.indexOf('content://') === -1
        ? 'file://'
        : '') + item.value[0].uri
    return (
      <TouchableOpacity onPress={this._clickRow.bind(this, item)}>
        <View style={styles.cell}>
          <View style={styles.left}>
            <Image
              style={styles.image}
              source={{ uri: uri }}
              resizeMode="cover"
            />
            <Text style={styles.text}>
              {item.name + ' (' + item.value.length + ')'}
            </Text>
          </View>
          <View style={styles.right}>
            {selectedCount > 0 && (
              <Text style={styles.selectedcount}>{'' + selectedCount}</Text>
            )}
            <Image
              source={require('./images/arrow_right.png')}
              style={styles.arrow}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  getPhotos = async assetType => {
    let result = await CameraRoll.getPhotos({
      first: 1000000,
      groupTypes: Platform.OS === 'ios' ? this.props.groupTypes : undefined,
      assetType: assetType,
    })
    const arr = result.edges.map(item => item.node)
    const dict = arr.reduce((prv, cur) => {
      const curValue = {
        type: cur.type,
        location: cur.location,
        timestamp: cur.timestamp,
        ...cur.image,
      }
      if (!prv[cur.group_name]) {
        prv[cur.group_name] = [curValue]
      } else {
        prv[cur.group_name].push(curValue)
      }
      return prv
    }, {})
    const data = Object.keys(dict)
      .sort((a, b) => {
        const rootIndex = 'Camera Roll'
        if (a === rootIndex) {
          return -1
        } else if (b === rootIndex) {
          return 1
        } else {
          return a < b ? -1 : 1
        }
      })
      .map(key => ({ name: key, value: dict[key] }))
    return data
  }

  _onBackFromAlbum = items => {
    this.setState({ selectedItems: [...items] })
  }

  _clickCancel = () => {
    this.props.callback && this.props.callback([])
  }

  _clickRow = item => {
    this.props.navigation.navigate(PageKeys.album_view, {
      ...this.props,
      groupName: item.name,
      photos: item.value,
      selectedItems: this.state.selectedItems,
      onBack: this._onBackFromAlbum,
    })
  }

  _onWindowChanged = () => {
    this.forceUpdate()
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRight: {
    color: 'white',
    width: scaleSize(100),
    fontSize: size.fontSize.fontSizeXXl,
    textAlign: 'right',
  },
  safeView: {
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  cell: {
    height: scaleSize(80),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6ea',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    overflow: 'hidden',
    width: 44,
    height: 44,
  },
  text: {
    fontSize: size.fontSize.fontSizeMd,
    color: 'black',
    marginLeft: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  selectedcount: {
    width: 18,
    height: 18,
    ...Platform.select({
      ios: { lineHeight: 18 },
      android: { textAlignVertical: 'center' },
    }),
    fontSize: 11,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#e15151',
    borderRadius: 9,
    overflow: 'hidden',
  },
  arrow: {
    width: 13,
    height: 16,
    marginLeft: 10,
    marginRight: 0,
  },
})
