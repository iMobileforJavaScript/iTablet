import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native'
import { Dialog } from '../../../components'
import { scaleSize, Toast } from '../../../utils'
import { color, size } from '../../../styles'
import { FileTools } from '../../../native'
import { OnlineService } from 'imobile_for_reactnative'
import { ConstPath } from '../../../constants'
import NavigationService from '../../NavigationService'
export default class UploadDialog extends PureComponent {
  props: {
    confirmAction: any,
    data: any,
    cancelAction: any,
    confirmBtnTitle: String,
  }

  constructor(props) {
    super(props)
    this.state = {
      dataName: '',
    }
  }

  setDialogVisible(visible) {
    this.dialog && this.dialog.setDialogVisible(visible)
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
  }

  getZipList = async () => {
    let zipList = []
    // Object.keys(this.props.data).forEach(element => {
    //   // FileTools.copyFile(this.props.data[element], fartherPath)
    //   zipList.push(this.props.data[element])
    // })
    for (const key in this.props.data) {
      if (this.props.data.hasOwnProperty(key)) {
        let path = await FileTools.appendingHomeDirectory(this.props.data[key])
        zipList.push(path)
      }
    }
    return zipList
  }

  uploading = async progress => {
    if (Platform.OS === 'android') {
      progress === 100 && this.onComplete()
    }
  }
  onComplete() {
    FileTools.deleteFile(this.zipPath)
    Toast.show('上传成功')
    NavigationService.goBack()
  }
  upLoad = async () => {
    try {
      if (this.state.dataName !== '') {
        let toPath =
          (await FileTools.appendingHomeDirectory(ConstPath.LocalDataPath)) +
          this.state.dataName +
          '.zip'
        this.zipPath = toPath
        let zipList = await this.getZipList()
        await Toast.show('文件压缩中')
        let result = await FileTools.zipFiles(zipList, toPath)
        if (result) {
          this.dialog.setDialogVisible(false)
          Toast.show('文件上传中......')
          this.OnlineService = new OnlineService()
          let result = await this.OnlineService.login(
            'jiushuaizhao1995@163.com',
            'z549451547',
          )
          if (result) {
            await this.OnlineService.upload(toPath, this.state.dataName, {
              onProgress: this.uploading,
              onComplete: this.onComplete,
              onFailure: this.uploadFailure,
            })
          }
        } else {
          this.dialog.setDialogVisible(false)
          Toast.show('文件压缩失败')
        }
      } else {
        Toast.show('请输入数据名称')
      }
    } catch (error) {
      this.dialog.setDialogVisible(false)
      Toast.show('上传失败')
    }
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        style={{ marginVertical: 15 }}
        confirmAction={this.upLoad}
        cancelAction={this.cancel}
        confirmBtnTitle={this.props.confirmBtnTitle}
      >
        <View style={styles.item}>
          <Text style={styles.title}>数据名称</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            accessible={true}
            accessibilityLabel={'数据名称'}
            onChangeText={text => {
              this.setState({
                dataName: text,
              })
            }}
            value={this.state.dataName}
            placeholder={'请输入数据名称'}
            style={styles.textInputStyle}
          />
        </View>
      </Dialog>
    )
  }
}
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scaleSize(30),
    height: scaleSize(80),
  },
  title: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.title,
    width: scaleSize(160),
  },
  textInputStyle: {
    flex: 1,
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: color.gray3,
  },
})
