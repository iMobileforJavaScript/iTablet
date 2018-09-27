import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Dialog } from '../../../components'
import { scaleSize } from '../../../utils'
import { color, size } from '../../../styles'
import { Utility } from 'imobile_for_javascript'
import { ConstPath } from '../../../constains'
import Toast from 'react-native-root-toast';
export default class UploadDialog extends PureComponent {

  props: {
    confirmAction: any,
    data: any,
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
  upload = async () => {
    debugger
    try {
      let toPath = await Utility.appendingHomeDirectory(ConstPath.LocalDataPath) + this.state.dataName
      let exist = await Utility.fileIsExistInHomeDirectory(toPath)
      if (exist) {
        Toast.show("已存在文件夹，请重命名")
      } else {
        let result =await Utility.createDirectory(toPath)
        if (result) {
          Object.keys(this.props.data).forEach(element => {
            // this.props.data[element]
            Utility.copyFile(this.props.data[element],toPath)
          })
        }else{
          Toast.show("上传失败")
        }
      }
    } catch (error) {
      Toast.show("上传失败")
    }
  }

  render() {
    return (
      <Dialog
        ref={ref => this.dialog = ref}
        style={{ marginVertical: 15 }}
        confirmAction={this.upload}
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
            style={styles.textInputStyle} />
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
    borderWidth: scaleSize(1),
    borderColor: color.gray3,
  },
})