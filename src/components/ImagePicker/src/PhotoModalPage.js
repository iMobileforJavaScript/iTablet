import React from 'react'
import {
  View,
  Modal,
  BackHandler,
  InteractionManager,
  Platform,
  Dimensions,
} from 'react-native'
import { createAppContainer, createStackNavigator } from 'react-navigation'
import PageKeys from './PageKeys'
import AlbumListView from './AlbumListView'
import AlbumView from './AlbumView'
// import PreviewMultiView from './PreviewMultiView'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'

export default class extends React.PureComponent {
  static defaultProps = {
    okLabel: 'OK',
    cancelLabel: 'Cancel',
    deleteLabel: 'Delete',
    useVideoLabel: 'Use Video',
    usePhotoLabel: 'Use Photo',
    previewLabel: 'Preview',
    choosePhotoTitle: 'Choose Photo',
    maxSizeChooseAlert: number =>
      GLOBAL.language === 'EN'
        ? 'You can only choose ' + number + ' photos at most'
        : '您最多能选择' + number + '张照片',
    maxSizeTakeAlert: number =>
      'You can only take ' + number + ' photos at most',
    supportedOrientations: ['portrait', 'landscape'],
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._clickBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._clickBack)
  }

  render() {
    const callback = data => {
      this.props.callback && this.props.callback(data)
      InteractionManager.runAfterInteractions(() => {
        this.props.onDestroy && this.props.onDestroy()
      })
    }
    const allscenes = {
      [PageKeys.album_list]: AlbumListView,
      [PageKeys.album_view]: AlbumView,
      // [PageKeys.preview]: PreviewMultiView,
    }
    const withUnwrap = WrappedComponent =>
      class extends React.PureComponent {
        render() {
          return (
            <WrappedComponent
              {...this.props.navigation.state.params}
              navigation={this.props.navigation}
            />
          )
        }
      }
    const scenes = Object.keys(allscenes).reduce((prv, cur) => {
      prv[cur] = {
        screen: withUnwrap(allscenes[cur]),
        navigationOptions: {
          gesturesEnabled: false,
        },
      }
      return prv
    }, {})
    const NavigationDoor = createAppContainer(
      createStackNavigator(scenes, {
        initialRouteName: this.props.initialRouteName,
        initialRouteParams: {
          ...this.props,
          callback: callback,
        },
        headerMode: 'none',
        transitionConfig: () => ({
          screenInterpolator: StackViewStyleInterpolator.forHorizontal,
        }),
      }),
    )
    const deviceHeight =
      Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : ExtraDimensions.getRealWindowHeight() -
          ExtraDimensions.getStatusBarHeight() -
          (ExtraDimensions.isSoftMenuBarEnabled()
            ? ExtraDimensions.getSoftMenuBarHeight()
            : 0)
    const deviceWidth = Dimensions.get('window').width
    return (
      <Modal
        animationType={'slide'}
        supportedOrientations={this.props.supportedOrientations}
        style={{ flex: 1 }}
      >
        <View style={{ height: deviceHeight, width: deviceWidth }}>
          <NavigationDoor />
        </View>
      </Modal>
    )
  }

  _clickBack = () => {
    this.props.onDestroy && this.props.onDestroy()
    return true
  }
}
