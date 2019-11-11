/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  InteractionManager,
} from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { AnalystItem, PopModalList } from '../../components'
import { SAnalyst } from 'imobile_for_reactnative'
import styles from './styles'

export default class SourceDatasetPage extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    language: String,
    iServerData: String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb

    this.inputTypes = [
      { key: 'iServer Catalog', value: 'iServer Catalog' },
      { key: 'HDFS', value: 'HDFS' },
    ]

    let inputType = this.inputTypes[0]
    if (params && params.inputType) {
      for (let type of this.inputTypes) {
        if (type.value === params.inputType) {
          inputType = type
          break
        }
      }
    }

    this.state = {
      headerTitle: params && params.headerTitle ? params.headerTitle : '',
      inputType: inputType,
      datasets: params && params.datasets ? params.datasets : [],
      dataset: params && params.dataset ? params.dataset : '',

      popData: [],
    }
  }

  componentDidMount() {
    if (
      this.props.iServerData &&
      this.props.iServerData.ip &&
      this.props.iServerData.port &&
      this.state.datasets.length === 0
    ) {
      InteractionManager.runAfterInteractions(() => {
        SAnalyst.getOnlineAnalysisData(
          this.props.iServerData.ip,
          this.props.iServerData.port,
          0,
        ).then(data => {
          let datasets = []
          if (data.datasetCount > 0) {
            data.datasetNames.forEach(datasetName => {
              datasets.push({ key: datasetName, value: datasetName })
            })
          }
          if (datasets.length > 0) {
            this.setState({
              datasets,
              dataset: datasets[0],
            })
          }
        })
      })
    }
  }

  back = () => {
    if (this.backcb) {
      this.backcb()
    } else {
      this.props.navigation.goBack()
    }
  }

  confirm = () => {
    if (this.cb && typeof this.cb === 'function') {
      if (!this.state.inputType || !this.state.inputType.value) {
        Toast.show(
          getLanguage(this.props.language).Analyst_Prompt
            .PLEASE_CHOOSE_INPUT_METHOD,
        )
        return
      }
      if (!this.state.dataset || !this.state.dataset.value) {
        Toast.show(
          getLanguage(this.props.language).Analyst_Prompt.PLEASE_CHOOSE_DATASET,
        )
        return
      }
      this.cb({
        inputType: this.state.inputType.value,
        dataset: this.state.dataset.value,
      })
    }
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
            case 0:
              newStateData = { inputType: data }
              break
            case 1:
              newStateData = { dataset: data }
              break
          }
          this.setState(newStateData, () => {
            this.popModal && this.popModal.setVisible(false)
          })
        }}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: this.state.headerTitle,
          backAction: this.back,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Analyst_Labels.CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={this.confirm}
            />
          ),
        }}
      >
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
          <AnalystItem
            title={getLanguage(this.props.language).Analyst_Labels.Input_Type}
            value={this.state.inputType.value}
            onPress={async () => {
              this.currentPop = 0
              this.setState(
                {
                  popData: this.inputTypes,
                  currentPopData: this.state.inputType,
                },
                () => {
                  this.popModal && this.popModal.setVisible(true)
                },
              )
            }}
          />
          <AnalystItem
            title={getLanguage(this.props.language).Analyst_Labels.Dataset}
            value={(this.state.dataset && this.state.dataset.value) || ''}
            onPress={async () => {
              this.currentPop = 1
              this.setState(
                {
                  popData: this.state.datasets,
                  currentPopData: this.state.dataset,
                },
                () => {
                  this.popModal && this.popModal.setVisible(true)
                },
              )
            }}
          />
        </KeyboardAvoidingView>
        {this.renderPopList()}
      </Container>
    )
  }
}
