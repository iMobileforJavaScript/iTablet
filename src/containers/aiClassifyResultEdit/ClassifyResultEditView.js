import * as React from 'react'
import {
  InteractionManager,
  View,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container } from '../../components'
import Button from '../../components/Button/Button'
import { SAIClassifyView } from 'imobile_for_reactnative'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'

/*
 * 分类结果编辑界面
 */
export default class ClassifyResultEditView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.datasourceAlias = params.datasourceAlias || ''
    this.datasetName = params.datasetName || ''
    this.imagePath = params.imagePath || ''
    this.classifyTime = params.classifyTime || ''
    this.cb = params && params.cb

    this.remarks = '' //备注

    this.state = {
      mediaName: params.mediaName || '',
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {}.bind(this)())
    })
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations()
    //移除监听
  }

  back = () => {
    NavigationService.goBack()
    return true
  }

  save = async () => {
    let result = await SAIClassifyView.modifyLastItem({
      datasourceAlias: this.datasourceAlias,
      datasetName: this.datasetName,
      mediaName: this.state.mediaName,
      remarks: this.remarks,
    })
    if (result) {
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY)
      this.cb && this.cb()
    }
  }

  renderImageViewer = () => {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: this.imagePath }} />
      </View>
    )
  }

  renderInfoViewer = () => {
    return (
      <KeyboardAvoidingView
        enabled={true}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'column',
        }}
        behavior={Platform.OS === 'ios' && 'position'}
      >
        <View style={styles.infocontainer}>
          <View style={styles.classifyTitleView}>
            <Text style={styles.title}>
              {
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_NAME
              }
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.edit}
              numberOfLines={2}
              onChangeText={text => this.setState({ mediaName: text })}
              value={this.state.mediaName}
            />
          </View>
          <View style={styles.classifyTitleView}>
            <Text style={styles.title}>
              {
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_TIME
              }
            </Text>
            <Text style={styles.titleConfidence}>{this.classifyTime}</Text>
          </View>
          <View style={styles.classifyTitleView}>
            <Text style={styles.title}>
              {
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_REMARKS
              }
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.edit}
              numberOfLines={2}
              onChangeText={text => (this.remarks = text)}
              placeholder={
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_PLEA_REMARKS
              }
              placeholderTextColor={'#A0A0A0'}
            />
          </View>
          <Button
            style={styles.btnSwitchModelsView}
            titleStyle={styles.txtBtnSwitchModelsView}
            title={
              getLanguage(global.language).Map_Main_Menu
                .MAP_AR_AI_ASSISTANT_CLASSIFY_SAVE
            }
            type={'BLUE'}
            activeOpacity={0.8}
            onPress={() => this.save()}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_CLASSIFY,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <View style={styles.container}>
          {this.renderImageViewer()}
          {this.renderInfoViewer()}
        </View>
      </Container>
    )
  }
}
