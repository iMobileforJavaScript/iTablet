//ヒント语
const Prompt = {
  YES: 'はい',
  NO: 'いいえ',
  SAVE_TITLE: '現在マップを保存しますか',
  SAVE_YES: '保存',
  SAVE_NO: '保存しない',
  CANCEL: 'キャンセル',
  COMMIT: 'コミット',
  REDO: 'やり直す',
  UNDO: '取り消す',
  SHARE: 'シェア',
  DELETE: '削除',
  WECHAT: 'WeChat',
  BEGIN: '開始',
  STOP: '停止',
  FIELD_TO_PAUSE: '一時停止に失敗しまいｓた',
  WX_NOT_INSTALLED: 'WeChatはありません',
  WX_SHARE_FAILED:
    'WeChatにシェアのに失敗しました。WeChatをインストールしているかどうかを確認ください',
  RENAME: '名前変更',
  BATCH_DELETE: 'バッチ削除',

  DOWNLOAD_SAMPLE_DATA: 'サンプルデータをダウンロードしますか？',
  DOWNLOAD: 'ダウンロード',
  DOWNLOADING: 'ダウンロード中',
  DOWNLOAD_SUCCESSFULLY: 'ダウンロード済',
  DOWNLOAD_FAILED: 'ダウンロードに失敗しました',

  NO_REMINDER: '次回からヒントを表示しません',

  LOG_OUT: 'ログアウトしますか？',
  FAILED_TO_LOG: 'ログインに失敗しました',
  INCORRECT_USER_INFO: 'ユーザー名、またはパスワードは不正です',
  INCORRECT_IPORTAL_ADDRESS: 'サーバーアドレスは正かどうかを確認してください',

  DELETE_STOP: '目標ポイントを削除しますか?',
  DELETE_OBJECT: '当オブジェクトを削除しますか?',
  PLEASE_ADD_STOP: '目標ポイントを追加してください',

  CONFIRM: 'OK',
  COMPLETE: '完了',

  OPENING: '開く中',

  QUIT: 'SuperMap iTabletを閉じますか?',
  MAP_LOADING: 'マップロード中',
  LOADING: 'ロード中',
  THE_MAP_IS_OPENED: '当マップは開いています',
  THE_SCENE_IS_OPENED: '当シーンは開いています',
  NO_SCENE_LIST: 'シーンリストはありません',
  SWITCHING: 'マップ切り替え中',
  CLOSING: 'マップ閉じ中',
  CLOSING_3D: 'マップを閉じ中',
  SAVING: 'マップ保存中',
  SWITCHING_SUCCESS: '切替にに成功',
  ADD_SUCCESS: '追加にに成功',
  ADD_FAILED: '追加に失敗',
  ADD_MAP_FAILED: '現在マップに追加できません',
  CREATE_THEME_FAILED: '主題図の作成に失敗しました',
  PLEASE_ADD_DATASET: '追加するデータセットを選択してください',
  PLEASE_SELECT_OBJECT: '編集オブジェクトを選択してください',
  SWITCHING_PLOT_LIB: 'アニメシンボルライブラリを切り替え中',
  NON_SELECTED_OBJ: '選択オブジェクトはありません',
  CHANGE_BASE_MAP:
    '現在ベースマップはありません。ベースマップを切替えてください。',

  SET_ALL_MAP_VISIBLE: 'すべて表示',
  SET_ALL_MAP_INVISIBLE: 'すべて非表示',
  LONG_PRESS_TO_SORT: '（長押しソート）',

  PUBLIC_MAP: 'パブリックマップ',
  SUPERMAP_FORUM: 'SuperMap Forum',
  SUPERMAP_KNOW: 'SuperMap Know',
  SUPERMAP_GROUP: 'SuperMap Group',
  INSTRUCTION_MANUAL: 'ヘルプ',
  THE_CURRENT_LAYER: '現在レイヤー',
  ENTER_KEY_WORDS: '検索キーワード入力してください',
  SEARCHING: '検索中',
  READING_DATA: 'データ読取中',
  CREATE_SUCCESSFULLY: '作成に成功',
  SAVE_SUCCESSFULLY: '保存に成功',
  NO_NEED_TO_SAVE: '保存する必要はありません',
  SAVE_FAILED: '保存に失敗',
  ENABLE_DYNAMIC_PROJECTION: 'アクティブ投影を使用かどうか',
  TURN_ON: 'はい',
  CREATE_FAILED: '作成に失敗',
  INVALID_DATASET_NAME: 'データセット名は無効で、または存在します',

  NO_PLOTTING_DEDUCTION: '現在マップに展開リストはありません',
  NO_FLY: '現在シーンに飛行ルートはありません',
  PLEASE_OPEN_SCENE: 'シーンを開いてください',
  NO_SCENE: 'シーン表示無し',

  PLEASE_ENTER_TEXT: 'テキスト内容を入力してください',
  PLEASE_SELECT_THEMATIC_LAYER: '主題図レイヤーを選択してください',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED:
    '現在レイヤーにスタイルを設定できません。レイヤーを再度選択してください。',

  PLEASE_SELECT_PLOT_LAYER: 'マークレイヤーを選択、または新規してください',
  DONOT_SUPPORT_ARCORE: '当デバイスはARCoreをサポートしません',
  PLEASE_NEW_PLOT_LAYER: '新規マークレイヤーを作成しますか',
  DOWNLOADING_PLEASE_WAIT: 'ダウンロード中、お待ちください',
  SELECT_DELETE_BY_RECTANGLE: '削除オブジェクトを選択してください',

  CHOOSE_LAYER: '選択レイヤー',

  COLLECT_SUCCESS: 'コレクションに成功',

  SELECT_TWO_MEDIAS_AT_LEAST:
    '少なくとも2つのメディアファイルを選択してください',

  NETWORK_REQUEST_FAILED: 'ネットワークリクエストに失敗しました',

  SAVEING: '保存中',
  CREATING: '作成中',
  PLEASE_ADD_DATASOURCE: 'データソースを追加してください',
  NO_ATTRIBUTES: '属性無し',
  NO_SEARCH_RESULTS: '検索レコードはありません',

  READING_TEMPLATE: 'テンプレート読取中',
  SWITCHED_TEMPLATE: 'テンプレートは切替されました',
  THE_CURRENT_SELECTION: '現在の選択は ',

  IMPORTING_DATA: 'データインポート中',
  DATA_BEING_IMPORT: 'データインポート中',
  IMPORTING: 'インポート中...',
  IMPORTED_SUCCESS: 'インポートに成功',
  FAILED_TO_IMPORT: 'インポートに失敗',
  IMPORTED_3D_SUCCESS: 'インポート3Dに成功',
  FAILED_TO_IMPORT_3D: 'インポート3Dに失敗',
  DELETING_DATA: 'データ削除中',
  DELETING_SERVICE: 'サービス削除中',
  DELETED_SUCCESS: '削除に成功',
  FAILED_TO_DELETE: '削除に失敗',
  PUBLISHING: '配信サービス中',
  PUBLISH_SUCCESS: '配信に成功',
  PUBLISH_FAILED: '配信に失敗',
  DELETE_CONFIRM: '現在データを削除しますか？',
  BATCH_DELETE_CONFIRM: '現在の選択データを削除しますか？',

  SELECT_AT_LEAST_ONE: '少なくとも1つのデータを削除してください',
  DELETE_MAP_RELATE_DATA:
    'データ削除は以下のマップに影響があります\n削除しますか？',

  LOG_IN: 'ログイン中',
  ENTER_MAP_NAME: 'マップ名を入力してください',
  CLIP_ENTER_MAP_NAME: 'マップ名を入力してください',
  ENTER_SERVICE_ADDRESS: 'サービスアドレスを入力してください',
  ENTER_ANIMATION_NAME: 'アニメーション名を入力してください',
  ENTER_ANIMATION_NODE_NAME: 'アニメーションノード名入力してください',
  PLEASE_SELECT_PLOT_SYMBOL: 'アニメシンボルシンボルを選択してください',

  ENTER_NAME: '名称を入力してください',

  CLIPPING: 'マップクリップ中',
  CLIPPED_SUCCESS: 'クリップに成功',
  CLIP_FAILED: 'クリップに失敗',

  LAYER_CANNOT_CREATE_THEMATIC_MAP:
    '当レイヤーで主題図を作成することをサポートしません',

  ANALYSING: '解析中',
  CHOOSE_STARTING_POINT: '起点を入力してください',
  CHOOSE_DESTINATION: '終点を入力してください',

  LATEST: '最後変更時間: ',
  GEOGRAPHIC_COORDINATE_SYSTEM: '地理座標系: ',
  PROJECTED_COORDINATE_SYSTEM: '投影座標系: ',
  FIELD_TYPE: 'フィールドタイプ: ',

  PLEASE_LOGIN_AND_SHARE: 'ログインしてシェアします',
  SHARING: 'シェア中',
  SHARE_SUCCESS: 'シェアに成功',
  SHARE_FAILED: 'シェアに失敗',
  SHARE_PREPARE: 'シェア準備',
  SHARE_START: 'シェア開始',

  EXPORTING: 'エクスポート中',
  EXPORT_SUCCESS: 'エクスポートに成功',
  EXPORT_FAILED: 'エクスポートに失敗',
  EXPORT_TO: 'データエクスポート先：',
  REQUIRE_PRJ_1984:
    'データセットの投影座標系はWGS_1984に設定する必要があります',

  UNDO_FAILED: '取り消すに失敗',
  REDO_FAILED: 'やり直すに失敗',
  RECOVER_FAILED: '復元に失敗',

  SETTING_SUCCESS: '設定に成功',
  SETTING_FAILED: '設定に失敗',
  NETWORK_ERROR: 'ネットワークエラー',
  NO_NETWORK: 'ネットワークに接続しません',
  CHOOSE_CLASSIFY_MODEL: 'モデルタイプを選択してください',
  USED_IMMEDIATELY: 'すぐに使用',
  USING: '使用中',
  DEFAULT_MODEL: 'デフォルトモデル',
  DUSTBIN_MODEL: 'ゴミモデル',
  PLANT_MODEL: '植物モデル',
  CHANGING: '切り替え中',
  CHANGE_SUCCESS: '切り替えに成功',
  CHANGE_FAULT: '切り替えに失敗',
  DETECT_DUSTBIN_MODEL: 'ゴミ箱モデル',
  ROAD_MODEL: '道路モデル',

  LICENSE_EXPIRED:
    'トライアルライセンスは期限切れです。続けてトライアルしますか?',
  APPLY_LICENSE: 'ライセンス申請',
  APPLY_LICENSE_FIRST: '有効なライセンスを取得してください',

  GET_LAYER_GROUP_FAILD: 'レイヤーグループの取得に失敗',
  TYR_AGAIN_LATER: '後で再度試してださい',

  LOCATING: 'ポジショニング中',
  CANNOT_LOCATION: 'ポジショニングできません',
  INDEX_OUT_OF_BOUNDS: '位置の越境',
  PLEASE_SELECT_LICATION_INFORMATION: 'ポジショニング情報を選択してください',
  OUT_OF_MAP_BOUNDS: 'マップ範囲内にありません',
  CANT_USE_TRACK_TO_INCREMENT_ROAD:
    '現在位置は道路ネットワークデータセット内にありません。トラックインクリメント道路ネットワークを使用できません。',

  POI: 'POI',

  ILLEGAL_DATA: 'データは無効です!',

  UNSUPPORTED_LAYER_TO_SHARE: '当レイヤーのシェアをサポートしません',
  SELECT_DATASET_TO_SHARE: 'シェアするデータセットを選択してください',
  ENTER_DATA_NAME: 'データ名を入力してください',
  SHARED_DATA_10M: 'シェアファイルは10MBを超えします',

  PHIONE_HAS_BEEN_REGISTERED: '携帯番号が登録されました',
  NICKNAME_IS_EXISTS: 'ニックネームは存在しています',
  VERIFICATION_CODE_ERROR: 'ショートメッセージ検証コード不正',
  VERIFICATION_CODE_SENT: '検証コードは送信しました',
  EMAIL_HAS_BEEN_REGISTERED: 'メールアドレスはレジスタされました',
  REGISTERING: 'レジスタ中',
  REGIST_SUCCESS: 'レジスタに成功',
  REGIST_FAILED: 'レジスタに失敗',
  GOTO_ACTIVATE: 'メールでアクティベーションしてください',
  ENTER_CORRECT_MOBILE: '正しい携帯番号を入力してください',
  ENTER_CORRECT_EMAIL: '正しいメールアドレスを入力してください',

  //設定菜单ヒント情報
  ROTATION_ANGLE_ERROR: '回転角度を-360°～360°に設定してください',
  MAP_SCALE_ERROR: 'スケールの入力は不正です。1つの数字を入力してください',
  VIEW_BOUNDS_ERROR: '範囲の入力は不正です。1つの数字を入力してください',
  VIEW_BOUNDS_RANGE_ERROR:
    'パラメータは不正です。ウィンドウの幅、高さを0以上に設定してください',
  MAP_CENTER_ERROR: '座標の入力は不正です。x,yを数字に設定してください',
  COPY_SUCCESS: 'コピーに成功',
  //コピー座標系
  COPY_COORD_SYSTEM_SUCCESS: '座標系のコピーに成功',
  COPY_COORD_SYSTEM_FAIL: '座標系のコピーに失敗',
  ILLEGAL_COORDSYS: '選択ファイルはサポートする座標系ファイルではありません',

  TRANSFER_PARAMS: 'パラメータは不正です。1つの数字を入力してください',
  PLEASE_ENTER: '入力してください',

  REQUEST_TIMEOUT: 'リクエストはタイムアウト',

  IMAGE_RECOGNITION_ING: '識別中',
  IMAGE_RECOGNITION_FAILED: '画像の識別に失敗',

  ERROR_INFO_INVALID_URL: '無効なURL',
  ERROR_INFO_NOT_A_NUMBER: '数字ではありません',
  ERROR_INFO_START_WITH_A_LETTER:
    '最初の文字は、アルファベットまたはかな・漢字に設定する必要があります',
  ERROR_INFO_ILLEGAL_CHARACTERS: '特殊符号を含むことはできません',
  ERROR_INFO_EMPTY: '空に設定することができません',

  OPEN_LOCATION:
    'システムにポジショニングサービスを使用する機能を設定してください',
  REQUEST_LOCATION: 'iTabletはポジショニング権限が必要です',
  LOCATION_ERROR: 'ポジショニング異常、後で再度試してください',

  OPEN_THRID_PARTY:
    'サードパーティのアプリケーションにジャンプしようとしています。継続しますか？',

  FIELD_ILLEGAL: 'フィールドは無効です',
  PLEASE_SELECT_A_RASTER_LAYER: 'ラスタレイヤーを選択してください',

  PLEASE_ADD_DATASOURCE_BY_UNIFORM:
    '"統一スタイル"でデータソースを追加してください',
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION:
    'ヒント:現在レイヤーは変更をサポートしません',

  FAILED_TO_CREATE_POINT: 'ポイント追加に失敗',
  FAILED_TO_CREATE_TEXT: '文字に追加失敗',
  FAILED_TO_CREATE_LINE: 'ライン追加に失敗',
  FAILED_TO_CREATE_REGION: 'ポリゴン追加に失敗',
  CLEAR_HISTORY: '検索歴史のクリア',
  //ナビ相关
  SEARCH_AROUND: '周囲を検索',
  GO_HERE: 'ここへ行く',
  SHOW_MORE_RESULT: 'もっと結果を確認',
  PLEASE_SET_BASEMAP_VISIBLE: 'ベースマップ表示できるように設定してください',
  NO_NETWORK_DATASETS:
    '現在ワークスペースにネットワークデータセットはありません',
  NO_LINE_DATASETS: '現在ワークスペースにラインデータセットはありません',
  NETWORK_DATASET_IS_NOT_AVAILABLE:
    '現在道路ネットワークデータセットは使用できません。',
  POINT_NOT_IN_BOUNDS:
    '現在の選択ポイントは道路ネットワークデータセット範囲内にありません',
  POSITION_OUT_OF_MAP:
    '現在位置は不在マップナビ範囲内にありません。シミュレーションナビを使用してください',
  SELECT_DATASOURCE_FOR_NAVIGATION: 'ナビルート解析のデータを選択してください',
  PLEASE_SELECT_NETWORKDATASET: 'ネットワークデータセットを選択してください',
  PLEASE_SELECT_A_POINT_INDOOR: '室内でポイントを選択してください',
  PATH_ANALYSIS_FAILED:
    'ルート解析に失敗しました。起点終点を再度選択してください',
  ROAD_NETWORK_UNLINK:
    '起点、終点の道路ネットワークは接続しません。ルート解析に失敗しました',
  CHANGE_TO_OUTDOOR: '室外に切り替えますか？',
  CHANGE_TO_INDOOR: '室内に切り替えますか',
  SET_START_AND_END_POINTS: '起点、終点を設定してください',
  SELECT_LAYER_NEED_INCREMENTED: 'インクリメントするレイヤーを選択してください',
  SELECT_THE_FLOOR: 'レイヤーがある階を選択してください',
  LONG_PRESS_ADD_START: '長押し起点を追加してください',
  LONG_PRESS_ADD_END: '長押し終点を追加してください',
  ROUTE_ANALYSING: 'ルート解析中',
  DISTANCE_ERROR: '現在開始ポイントの距離は近すぎです、再度選択してください',
  USE_ONLINE_ROUTE_ANALYST:
    '起始ポイントは道路ネットワークデータセット範囲内にありません、または開始ポイント近くに道路ネットワークはありません。オンラインルート解析を使用しますか？',
  NOT_SUPPORT_ONLINE_NAVIGATION: 'オンラインナビをサポートしません',

  //自定义专题图
  ONLY_INTEGER: '整数を入力してください',
  ONLY_INTEGER_GREATER_THAN_2: '２より大きい整数を入力してください',
  PARAMS_ERROR: 'パラメタエラー、設定に失敗しました！',

  SPEECH_TIP: '使用可能語句：\n"拡大"、"縮小"、"ポジショニング"、"閉じる"',
  SPEECH_ERROR: '識別に異常が発生します。後で再度試してください。',
  SPEECH_NONE: 'お話していないようですね',

  NOT_SUPPORT_STATISTIC: '当フィールドを統計をサポートしません',
  ATTRIBUTE_DELETE_CONFIRM: '選択フィールドを削除しますか？',
  ATTRIBUTE_DELETE_TIPS: '属性削除後で、復元できません',
  ATTRIBUTE_DELETE_SUCCESS: '属性フィールドの削除に成功しました',
  ATTRIBUTE_DELETE_FAILED: '属性フィールドの削除に失敗しました',
  ATTRIBUTE_ADD_SUCCESS: '属性の追加に成功しました',
  ATTRIBUTE_ADD_FAILED: '属性の追加に失敗しました',
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: 'デフォルト値は空です',
}

export { Prompt }
