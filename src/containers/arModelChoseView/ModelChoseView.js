import * as React from 'react'
import { InteractionManager, View, Image, Text, ScrollView } from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets } from '../../assets'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container } from '../../components'
import Button from '../../components/Button/Button'
// import { getLanguage } from '../../language'

/*
 * 模型选择界面
 */
export default class ModelChoseView extends React.Component {
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
    this.datasetName = params.datasetName

    this.state = {
      currentLength: 0,
      totalLength: 0,
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

  renderModelItem = () => {
    return (
      <View style={styles.ModelItemView}>
        <Image
          source={getThemeAssets().ar.icon_ar_measure_add}
          style={styles.img}
        />
        <Button
          style={styles.btnSwitchModelsView}
          titleStyle={styles.txtBtnSwitchModelsView}
          title={'立即使用'}
          type={'BLUE'}
          activeOpacity={0.5}
          onPress={() => this.choseMoreModel()}
        />
        <Text style={styles.titleSwitchModelsView}>{'一种模型'}</Text>
        <View style={styles.DividingLine} />
      </View>
    )
  }

  renderSwitchModels = () => {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.SwitchModelsView}
          contentContainerStyle={styles.scrollViewContentContainer}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          {this.renderModelItem()}
          {this.renderModelItem()}
          {this.renderModelItem()}
          {this.renderModelItem()}
          {this.renderModelItem()}
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: '请选择你的模型',
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderSwitchModels()}
      </Container>
    )
  }
}
