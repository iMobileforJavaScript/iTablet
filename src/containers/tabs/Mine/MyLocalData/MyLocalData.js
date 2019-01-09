import React, { Component } from 'react'
import { View, Text, SectionList, TouchableOpacity } from 'react-native'
import Container from '../../../../components/Container'
import { ConstPath, ConstInfo } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import LocalDataPopupModal from './LocalDataPopupModal'
import { color } from '../../../../styles'
import { SScene } from 'imobile_for_reactnative'
export default class MyLocalData extends Component {
  props: {
    navigation: Object,
    importWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      sectionData: [],
      userName: this.props.navigation.getParam('userName', ''),
      modalIsVisible: false,
    }
  }
  componentDidMount() {
    this._setSectionDataState()
  }

  _getHomePath = () => {
    return FileTools.appendingHomeDirectory()
  }
  /**
   * 深度遍历fullFileDir目录下的fileType数据
   * fullFileDir 文件目录
   * fileType 文件类型 {smwu:'smwu',sxwu:'sxwu',sxw:'sxw',smw:'smw',udb:'udb'}
   * arrFilterFile 添加到arrFilterFile数组中保存
   * */
  _setFilterDatas = async (fullFileDir, fileType, arrFilterFile) => {
    try {
      let isRecordFile = false
      let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
      for (let i = 0; i < arrDirContent.length; i++) {
        let fileContent = arrDirContent[i]
        let isFile = fileContent.type
        let fileName = fileContent.name
        let newPath = fullFileDir + '/' + fileName
        if (isFile === 'file' && !isRecordFile) {
          if (
            (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
            (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
            (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
            (fileType.smw && fileName.indexOf(fileType.smw) !== -1) ||
            (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
          ) {
            if (
              !(
                fileName.indexOf('~[') !== -1 &&
                fileName.indexOf(']') !== -1 &&
                fileName.indexOf('@') !== -1
              )
            ) {
              fileName = fileName.substring(0, fileName.length - 5)
              arrFilterFile.push({
                filePath: newPath,
                fileName: fileName,
                directory: fullFileDir,
              })
              isRecordFile = true
            }
          }
        } else if (isFile === 'directory') {
          await this._setFilterDatas(newPath, fileType, arrFilterFile)
        }
      }
    } catch (e) {
      Toast.show('没有数据')
    }
    return arrFilterFile
  }
  _setSectionDataState = async () => {
    let sectionData = await this._constructSectionData()
    this.setState({ sectionData: sectionData })
  }

  _constructSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path =
      this.homePath +
      ConstPath.UserPath +
      this.state.userName +
      '/' +
      ConstPath.RelativePath.ExternalData
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
    )
    // console.warn(newData)
    // {smwu:'smwu',sxwu:'sxwu',sxw:'sxw',smw:'smw',udb:'udb'}
    let smwuData = []
    let sxwuData = []
    let sxwData = []
    let smwData = []
    // let udbData=[]
    for (let i = 0; i < newData.length; i++) {
      let data = newData[i]
      if (data.filePath.indexOf('smwu') !== -1) {
        smwuData.push(data)
      } else if (data.filePath.indexOf('sxwu') !== -1) {
        sxwuData.push(data)
      } else if (data.filePath.indexOf('sxw') !== -1) {
        sxwData.push(data)
      } else if (data.filePath.indexOf('smw') !== -1) {
        smwData.push(data)
      }
      // else if(data.fileType === 'sxwu'){
      //   udbData.push(data)
      // }
    }
    let sectionData = [
      { title: '文件类型:smwu', data: smwuData, isShowItem: true },
      { title: '文件类型:sxwu', data: sxwuData, isShowItem: true },
      { title: '文件类型:sxw', data: sxwData, isShowItem: true },
      { title: '文件类型:smw', data: smwData, isShowItem: true },
    ]

    if (smwuData.length === 0) {
      for (let i = 0; i < sectionData.length; i++) {
        if (sectionData[i].title === '文件类型:smwu') {
          sectionData.splice(i, 1)
          break
        }
      }
    }

    if (sxwuData.length === 0) {
      for (let i = 0; i < sectionData.length; i++) {
        if (sectionData[i].title === '文件类型:sxwu') {
          sectionData.splice(i, 1)
          break
        }
      }
    }
    if (sxwData.length === 0) {
      for (let i = 0; i < sectionData.length; i++) {
        if (sectionData[i].title === '文件类型:sxw') {
          sectionData.splice(i, 1)
          break
        }
      }
    }
    if (smwData.length === 0) {
      for (let i = 0; i < sectionData.length; i++) {
        if (sectionData[i].title === '文件类型:smw') {
          sectionData.splice(i, 1)
          break
        }
      }
    }
    // console.warn(sectionData)
    return sectionData
  }

  _renderSectionHeader = info => {
    let title = info.section.title
    if (title !== undefined) {
      return (
        <Text
          style={[
            {
              color: 'white',
              lineHeight: 50,
              paddingLeft: 10,
              fontSize: 18,
              fontWeight: 'bold',
              width: '100%',
              height: 50,
              backgroundColor: '#2D2D2F',
            },
          ]}
          onPress={() => {
            let sectionData = [...this.state.sectionData]
            for (let i = 0; i < sectionData.length; i++) {
              let data = sectionData[i]
              if (data.title === title) {
                data.isShowItem = !data.isShowItem
                break
              }
            }
            this.setState({ sectionData: sectionData })
          }}
        >
          {title}
        </Text>
      )
    }
    return <View />
  }

  _renderItem = info => {
    let txtInfo = info.item.fileName
    let itemHeight = 50
    let separatorLineHeight = 2
    let display = info.section.isShowItem ? 'flex' : 'none'
    return (
      <TouchableOpacity
        display={display}
        onPress={() => {
          this.itemInfo = info
          this.setState({ modalIsVisible: true })
        }}
      >
        <View
          display={display}
          style={{
            width: '100%',
            flexDirection: 'row',
            backgroundColor: color.content,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: 'white',
              lineHeight: itemHeight,
              paddingLeft: 15,
              fontSize: 16,
              flex: 1,
              height: itemHeight,
            }}
          >
            {txtInfo}
          </Text>
          <Text
            style={{
              width: 100,
              height: itemHeight,
              lineHeight: itemHeight,
              textAlign: 'right',
              paddingRight: 15,
              color: 'white',
              fontSize: 20,
            }}
          >
            ...
          </Text>
        </View>
        <View
          display={display}
          style={{ width: '100%', height: separatorLineHeight }}
        />
      </TouchableOpacity>
    )
  }

  _keyExtractor = (section, index) => {
    return 'id:' + index
  }

  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _onDeleteData = async () => {
    try {
      if (this.itemInfo !== undefined) {
        let result = await FileTools.deleteFile(this.itemInfo.item.directory)
        if (result === true) {
          Toast.show('删除成功')
          let sectionData = [...this.state.sectionData]
          for (let i = 0; i < sectionData.length; i++) {
            let data = sectionData[i]
            if (data.title === this.itemInfo.section.title) {
              data.data.splice(this.itemInfo.index, 1)
              break
            }
          }
          this.setState({ sectionData: sectionData, modalIsVisible: false })
        }
      }
    } catch (e) {
      Toast.show('删除失败')
      this._closeModal()
    }
  }

  _onImportWorkspace = async () => {
    try {
      if (this.itemInfo !== undefined) {
        this.setLoading(true, ConstInfo.DATA_IMPORTING)
        let filePath = this.itemInfo.item.filePath
        let is3D = await SScene.is3DWorkspace({ server: filePath })
        if (is3D === true) {
          let result = await SScene.import3DWorkspace({ server: filePath })
          if (result === true) {
            Toast.show('导入3D成功')
          } else {
            Toast.show('导入3D失败')
          }
        } else {
          let result = await this.props.importWorkspace({ path: filePath })
          if (result.msg !== undefined) {
            Toast.show('导入失败')
          } else {
            Toast.show('导入成功')
          }
        }
        // let result = await SMap.importWorkspaceInfo({
        //   server: filePath,
        //   type: 9,
        // })
        // if (result.length > 0) {
        //   Toast.show('导入成功')
        // } else {
        //   Toast.show('导入失败')
        // }
        this.setLoading(false)
        this.setState({ modalIsVisible: false })
      }
    } catch (e) {
      this.setLoading(false)
      Toast.show('导入失败')
      this._closeModal()
    }
  }

  _showLocalDataPopupModal = () => {
    if (this.state.modalIsVisible) {
      return (
        <LocalDataPopupModal
          onDeleteData={this._onDeleteData}
          onImportWorkspace={this._onImportWorkspace}
          onCloseModal={this._closeModal}
          modalVisible={this.state.modalIsVisible}
        />
      )
    }
  }

  setLoading = (visible, info) => {
    this.container && this.container.setLoading(visible, info)
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '本地数据',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <SectionList
          sections={this.state.sectionData}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
        />
        {this._showLocalDataPopupModal()}
      </Container>
    )
  }
}
