import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  InteractionManager,
  KeyboardAvoidingView,
} from 'react-native'
import { Container } from '../../../../components'
import styles from './styles'
import NavigationService from '../../../NavigationService'
import { AnalystItem, PopModalList, AnalystBar } from '../../components'
import { ConstPath, Const } from '../../../../constants'
import { Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language'
import interpolationDetailParamsData from './interpolationDetailParamsData'
import { SMap, SAnalyst } from 'imobile_for_reactnative'

const popTypes = {
  SearchMethod: 'SearchMethod',
  Semivariogram: 'Semivariogram',
}

const defaultState = {
  // Settings
  radius: 0,
  pointCount: 12, // 2 - 12
  maxPointCountForInterpolation: 20, // 块查找
  maxPointCountInNode: 5, // 块查找
  // Others
  // IDW
  power: 2,
  // RBF
  tension: 40,
  smoothness: 0.1,
  // KRIGING
  semivariogram: interpolationDetailParamsData.getSemivariogram(
    GLOBAL.language,
  )[0],
  rotation: 0,
  sill: 0,
  range: 0,
  nuggetEffect: 0,
  mean: 23, // Simple KRIGING
  exponent: 1, // Universal KRIGING

  // 弹出框数据
  popData: [],
  currentPopData: null,

  canBeAnalyst: true,
}

export default class InterpolationAnalystDetailView extends Component {
  props: {
    language: String,
    navigation: Object,
    device: Object,
    currentUser: Object,
    getLayers: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.data = (params && params.data) || {}
    this.state = {
      title: (params && params.title) || '',
      ...defaultState,
      searchMethod: interpolationDetailParamsData.getSearchMethod(
        GLOBAL.language,
        params && params.title,
      )[0],
    }

    this.currentPop = ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  analyst = () => {
    Toast.show(getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_START)
    InteractionManager.runAfterInteractions(async () => {
      try {
        this.setLoading(
          true,
          getLanguage(this.props.language).Analyst_Prompt.ANALYSING,
        )

        let server = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            (this.props.currentUser.userName || 'Customer') +
            '/' +
            ConstPath.RelativePath.Datasource,
        )
        let sourceData = {
            datasource: this.data.dataSource.value,
            dataset: this.data.dataSet.value,
          },
          resultData = {
            datasource: this.data.resultDataSource.value,
            server: server + this.data.resultDataSource.value + '.udb',
            dataset: this.data.resultDataSet.value,
          },
          paramter = {
            type: this.data.method.value,
            resolution: this.data.resolution,
            bounds: {
              left: this.data.left,
              bottom: this.data.bottom,
              right: this.data.right,
              top: this.data.top,
            },
            searchMode: this.state.searchMethod.value,
            // exponent: this.state.exponent,
          }

        switch (this.state.searchMethod.value) {
          case SAnalyst.SearchMode.KDTREE_FIXED_COUNT:
          case SAnalyst.SearchMode.KDTREE_FIXED_RADIUS:
            Object.assign(paramter, {
              searchRadius: this.state.radius,
              expectedCount: this.state.pointCount,
            })
            break
          case SAnalyst.SearchMode.QUADTREE:
            Object.assign(paramter, {
              maxPointCountForInterpolation: this.state
                .maxPointCountForInterpolation,
              maxPointCountInNode: this.state.maxPointCountInNode,
            })
            break
        }

        switch (this.data.method.value) {
          case SAnalyst.InterpolationAlgorithmType.IDW:
          case SAnalyst.InterpolationAlgorithmType.RBF:
            Object.assign(paramter, {
              power: this.state.power,
            })
            break
          case SAnalyst.InterpolationAlgorithmType.KRIGING:
          case SAnalyst.InterpolationAlgorithmType.SIMPLE_KRIGING:
          case SAnalyst.InterpolationAlgorithmType.UNIVERSAL_KRIGING:
            Object.assign(paramter, {
              variogramMode: this.state.semivariogram.value,
              range: this.state.range,
              sill: this.state.sill,
              nugget: this.state.nuggetEffect,
            })
            if (SAnalyst.InterpolationAlgorithmType.SIMPLE_KRIGING) {
              paramter.mean = this.state.mean
            } else if (SAnalyst.InterpolationAlgorithmType.UNIVERSAL_KRIGING) {
              paramter.exponent = this.state.exponent
            }
            break
        }

        SAnalyst.interpolate(
          sourceData,
          resultData,
          paramter,
          this.data.interpolationField.name,
          this.data.scale,
          this.data.pixelFormat.value,
        )
          .then(async result => {
            this.setLoading(false)

            Toast.show(
              result
                ? getLanguage(this.props.language).Analyst_Prompt
                  .ANALYSIS_SUCCESS
                : getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
            )
            if (result) {
              let layers = await this.props.getLayers()
              layers.length > 0 && (await SMap.setLayerFullView(layers[0].path))

              GLOBAL.ToolBar && GLOBAL.ToolBar.setVisible(false)
              NavigationService.goBack('InterpolationAnalystView')
              if (this.cb && typeof this.cb === 'function') {
                this.cb()
              }
            }
          })
          .catch(() => {
            this.setLoading(false)
            Toast.show(
              getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_FAIL,
            )
          })
      } catch (e) {
        this.setLoading(false)
        Toast.show(
          getLanguage(this.props.language).Analyst_Prompt.ANALYSIS_SUCCESS,
        )
      }
    })
  }

  back = () => {
    NavigationService.goBack('InterpolationAnalystDetailView')
  }

  // 重置页面数据
  reset = () => {
    this.setState(Object.assign({}, this.state, defaultState))
    this.currentPop = ''
  }

  renderSearchSetting = () => {
    let arr = []
    switch (this.state.searchMethod.value) {
      case SAnalyst.SearchMode.KDTREE_FIXED_COUNT:
      case SAnalyst.SearchMode.KDTREE_FIXED_RADIUS:
        arr = this.renderVariableLengthSetting(this.state.searchMethod.value)
        break
      case SAnalyst.SearchMode.QUADTREE:
        arr = this.renderBlockSetting()
        break
    }
    return (
      <View key="searchSetting" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {
              getLanguage(this.props.language).Analyst_Labels
                .SAMPLE_POINT_SETTINGS
            }
          </Text>
        </View>
        <AnalystItem
          title={getLanguage(this.props.language).Analyst_Labels.SEARCH_MODE}
          value={(this.state.searchMethod && this.state.searchMethod.key) || ''}
          onPress={async () => {
            this.currentPop = popTypes.SearchMethod
            let searchMethods = interpolationDetailParamsData.getSearchMethod(
              this.props.language,
              this.state.title,
            )
            this.setState(
              {
                popData: searchMethods,
                currentPopData:
                  this.state.searchMethod ||
                  (searchMethods.length > 0 && searchMethods[0]) ||
                  null,
              },
              () => {
                this.popModal && this.popModal.setVisible(true)
              },
            )
          }}
        />
        {arr}
      </View>
    )
  }

  /** 变长/定长查找 **/
  renderVariableLengthSetting = type => {
    let title1 = '',
      title2 = '',
      numberRange1 = '',
      numberRange2 = ''
    if (type === SAnalyst.SearchMode.KDTREE_FIXED_COUNT) {
      title1 = getLanguage(this.props.language).Analyst_Labels.MAX_RADIUS
      title2 = getLanguage(this.props.language).Analyst_Labels
        .SEARCH_POINT_COUNT
      numberRange1 = '[0, )'
      numberRange2 = '[1, 2147483647]'
    } else if (type === SAnalyst.SearchMode.KDTREE_FIXED_RADIUS) {
      title1 = getLanguage(this.props.language).Analyst_Labels.SEARCH_RADIUS_2
      title2 = getLanguage(this.props.language).Analyst_Labels.MIX_COUNT
      numberRange1 = '[0, )'
      numberRange2 = '[2, 12]'
    }
    if (!title1 || !title2) return []
    return [
      <AnalystItem
        key={title1}
        title={title1}
        value={this.state.radius + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={numberRange1}
        onChangeText={text => {
          this.setState({
            radius: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.radius) {
            this.setState({
              radius: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.radius) {
            this.setState({
              radius: text,
            })
          }
        }}
      />,
      <AnalystItem
        key={title2}
        title={title2}
        value={this.state.pointCount + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={numberRange2}
        onChangeText={text => {
          this.setState({
            pointCount: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.pointCount) {
            this.setState({
              pointCount: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.pointCount) {
            this.setState({
              pointCount: text,
            })
          }
        }}
      />,
    ]
  }

  /** 块查找 **/
  renderBlockSetting = () => {
    return [
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.MOST_INVOLVED}
        title={getLanguage(this.props.language).Analyst_Labels.MOST_INVOLVED}
        value={this.state.maxPointCountForInterpolation + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={'[4, 2147483647]'}
        onChangeText={text => {
          this.setState({
            maxPointCountForInterpolation: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.maxPointCountForInterpolation) {
            this.setState({
              maxPointCountForInterpolation: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.maxPointCountForInterpolation) {
            this.setState({
              maxPointCountForInterpolation: text,
            })
          }
        }}
      />,
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.MOST_IN_BLOCK}
        title={getLanguage(this.props.language).Analyst_Labels.MOST_IN_BLOCK}
        value={this.state.maxPointCountInNode + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={'[1, 2147483647]'}
        onChangeText={text => {
          this.setState({
            maxPointCountInNode: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.maxPointCountInNode) {
            this.setState({
              maxPointCountInNode: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.maxPointCountInNode) {
            this.setState({
              maxPointCountInNode: text,
            })
          }
        }}
      />,
    ]
  }

  renderOthers = () => {
    let arr = []
    switch (this.data.method.key) {
      case getLanguage(this.props.language).Analyst_Params.IDW:
        arr = this.renderIDWOthers()
        break
      case getLanguage(this.props.language).Analyst_Params.SPLINE:
        arr = this.renderSplineOthers()
        break
      case getLanguage(this.props.language).Analyst_Params.ORDINARY_KRIGING:
      case getLanguage(this.props.language).Analyst_Params.SIMPLE_KRIGING:
      case getLanguage(this.props.language).Analyst_Params.UNIVERSAL_KRIGING:
        arr = this.renderKrigingOthers()
        break
    }
    return (
      <View key="others" style={styles.topView}>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>
            {getLanguage(this.props.language).Analyst_Labels.OTHER_PARAMETERS}
          </Text>
        </View>
        {arr}
      </View>
    )
  }

  /** 距离反比权重插值 **/
  renderIDWOthers = () => {
    return [
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.POWER}
        title={getLanguage(this.props.language).Analyst_Labels.POWER}
        value={this.state.power + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={'[0, 100]'}
        onChangeText={text => {
          this.setState({
            power: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.power) {
            this.setState({
              power: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.power) {
            this.setState({
              power: text,
            })
          }
        }}
      />,
    ]
  }

  /** 样条插值 **/
  renderSplineOthers = () => {
    return [
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.TENSION}
        title={getLanguage(this.props.language).Analyst_Labels.TENSION}
        value={this.state.tension + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={'[0, ]'}
        onChangeText={text => {
          this.setState({
            tension: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.tension) {
            this.setState({
              tension: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.tension) {
            this.setState({
              tension: text,
            })
          }
        }}
      />,
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.SMOOTHNESS}
        title={getLanguage(this.props.language).Analyst_Labels.SMOOTHNESS}
        value={this.state.smoothness + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={'[0, 1]'}
        onChangeText={text => {
          this.setState({
            smoothness: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.smoothness) {
            this.setState({
              smoothness: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.smoothness) {
            this.setState({
              smoothness: text,
            })
          }
        }}
      />,
    ]
  }

  /** 克吕金插值 **/
  renderKrigingOthers = () => {
    let arr = [
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.SEMIVARIOGRAM}
        title={getLanguage(this.props.language).Analyst_Labels.SEMIVARIOGRAM}
        value={(this.state.semivariogram && this.state.semivariogram.key) || ''}
        onPress={async () => {
          this.currentPop = popTypes.Semivariogram
          let semivariograms = interpolationDetailParamsData.getSemivariogram(
            this.props.language,
          )
          this.setState(
            {
              popData: semivariograms,
              currentPopData:
                this.state.semivariogram ||
                (semivariograms.length > 0 && semivariograms[0]) ||
                null,
            },
            () => {
              this.popModal && this.popModal.setVisible(true)
            },
          )
        }}
      />,
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.ROTATION}
        title={getLanguage(this.props.language).Analyst_Labels.ROTATION}
        value={this.state.rotation + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={'[0, 360]'}
        onChangeText={text => {
          this.setState({
            rotation: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.rotation) {
            this.setState({
              rotation: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.rotation) {
            this.setState({
              rotation: text,
            })
          }
        }}
      />,
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.SILL}
        title={getLanguage(this.props.language).Analyst_Labels.SILL}
        value={this.state.sill + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        rightStyle={{ flex: 1 }}
        inputStyle={{ flex: 1 }}
        autoCheckNumber
        onChangeText={text => {
          this.setState({
            sill: text === '' ? '' : parseFloat(text),
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.sill) {
            this.setState({
              sill: text === '' || isNaN(text) ? 0 : text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.sill) {
            this.setState({
              sill: text === '' || isNaN(text) ? 0 : text,
            })
          }
        }}
      />,
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.RANGE}
        title={getLanguage(this.props.language).Analyst_Labels.RANGE}
        value={this.state.range + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        inputStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        autoCheckNumber
        numberRange={'[0, ]'}
        onChangeText={text => {
          this.setState({
            range: text,
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.range) {
            this.setState({
              range: text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.range) {
            this.setState({
              range: text,
            })
          }
        }}
      />,
      <AnalystItem
        key={getLanguage(this.props.language).Analyst_Labels.NUGGET_EFFECT}
        title={getLanguage(this.props.language).Analyst_Labels.NUGGET_EFFECT}
        value={this.state.nuggetEffect + ''}
        keyboardType={'numeric'}
        rightType={'input'}
        inputStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        autoCheckNumber
        onChangeText={text => {
          this.setState({
            nuggetEffect: text === '' ? '' : parseFloat(text),
          })
        }}
        onSubmitEditing={text => {
          if (text !== this.state.nuggetEffect) {
            this.setState({
              nuggetEffect: text === '' || isNaN(text) ? 0 : text,
            })
          }
        }}
        onBlur={text => {
          if (text !== this.state.nuggetEffect) {
            this.setState({
              nuggetEffect: text === '' || isNaN(text) ? 0 : text,
            })
          }
        }}
      />,
    ]
    if (
      this.data.method.key ===
      getLanguage(this.props.language).Analyst_Params.SIMPLE_KRIGING
    ) {
      arr.splice(
        2,
        0,
        <AnalystItem
          key={getLanguage(this.props.language).Analyst_Labels.MEAN}
          title={getLanguage(this.props.language).Analyst_Labels.MEAN}
          value={this.state.mean + ''}
          keyboardType={'numeric'}
          rightType={'input'}
          inputStyle={{ flex: 1 }}
          rightStyle={{ flex: 1 }}
          autoCheckNumber
          onChangeText={text => {
            this.setState({
              mean: text === '' ? '' : parseFloat(text),
            })
          }}
          onSubmitEditing={text => {
            if (text !== this.state.mean) {
              this.setState({
                mean: text === '' || isNaN(text) ? 0 : text,
              })
            }
          }}
          onBlur={text => {
            if (text !== this.state.mean) {
              this.setState({
                mean: text === '' || isNaN(text) ? 0 : text,
              })
            }
          }}
        />,
      )
    } else if (
      this.data.method.key ===
      getLanguage(this.props.language).Analyst_Params.UNIVERSAL_KRIGING
    ) {
      arr.splice(
        2,
        0,
        <AnalystItem
          key={getLanguage(this.props.language).Analyst_Labels.EXPONENT}
          title={getLanguage(this.props.language).Analyst_Labels.EXPONENT}
          value={this.state.exponent + ''}
          rightProps={{
            minValue: 1,
            maxValue: 2,
          }}
          rightType={'number_counter'}
          onChange={value => {
            if (value !== this.state.exponent) {
              this.setState({
                exponent: value === '' ? '' : parseFloat(value),
              })
            }
          }}
        />,
      )
    }
    return arr
  }

  renderPopList = () => {
    return (
      <PopModalList
        ref={ref => (this.popModal = ref)}
        language={this.props.language}
        popData={this.state.popData}
        currentPopData={this.state.currentPopData}
        confirm={data => {
          let newStateData = {}
          switch (this.currentPop) {
            case popTypes.SearchMethod:
              Object.assign(
                newStateData,
                { ...defaultState },
                { searchMethod: data },
              )
              break
            case popTypes.Semivariogram:
              newStateData = { semivariogram: data }
              break
          }
          this.setState(newStateData, () => {
            this.popModal && this.popModal.setVisible(false)
          })
        }}
      />
    )
  }

  renderAnalystBar = () => {
    return (
      <AnalystBar
        style={styles.btnsView}
        leftTitle={getLanguage(this.props.language).Analyst_Labels.RESET}
        rightTitle={getLanguage(this.props.language).Analyst_Labels.ANALYST}
        leftAction={this.reset}
        rightAction={this.analyst}
        rightDisable={!this.state.canBeAnalyst}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        <KeyboardAvoidingView
          style={{ marginBottom: Const.BOTTOM_HEIGHT }}
          behavior="padding"
          keyboardVerticalOffset={-Const.BOTTOM_HEIGHT}
        >
          <ScrollView
            style={[
              styles.scrollView,
              { marginBottom: Const.BOTTOM_HEIGHT + 20 },
            ]}
          >
            {this.renderSearchSetting()}
            {this.renderOthers()}
          </ScrollView>
        </KeyboardAvoidingView>
        {this.renderAnalystBar()}
        {this.renderPopList()}
      </Container>
    )
  }
}
