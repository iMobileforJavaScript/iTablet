import * as React from 'react'
import { InteractionManager, View, Image, Text, TextInput } from 'react-native'
import NavigationService from '../../containers/NavigationService'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container } from '../../components'
import Button from '../../components/Button/Button'
// import { getLanguage } from '../../language'

/*
 * 模型选择界面
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
    this.mediaName = params.mediaName || ''

    this.state = {}
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

  renderImageViewer = () => {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: this.imagePath }} />
      </View>
    )
  }

  renderInfoViewer = () => {
    return (
      <View style={styles.infocontainer}>
        <View style={styles.classifyTitleView}>
          <Text style={styles.title}>{'物体名称:'}</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            style={styles.edit}
            numberOfLines={2}
            onChangeText={text => this.setState({ text })}
            value={this.mediaName}
          />
        </View>
        <View style={styles.classifyTitleView}>
          <Text style={styles.title}>{'识别时间:'}</Text>
          <Text style={styles.titleConfidence}>{'2019-05-23 15:45'}</Text>
        </View>
        <View style={styles.classifyTitleView}>
          <Text style={styles.title}>{'备注:'}</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            style={styles.edit}
            numberOfLines={2}
            onChangeText={text => this.setState({ text })}
            placeholder={'请填写备注'}
            placeholderTextColor={'#A0A0A0'}
          />
        </View>
        <Button
          style={styles.btnSwitchModelsView}
          titleStyle={styles.txtBtnSwitchModelsView}
          title={'保存'}
          type={'BLUE'}
          activeOpacity={0.8}
          onPress={() => this.choseMoreModel()}
        />
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: '目标分类',
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
