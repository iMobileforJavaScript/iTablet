const Analyst_Modules = {
  BUFFER_ANALYSIS: 'バッファ解析',
  BUFFER_ANALYSIS_2: 'バッファ解析',
  BUFFER_ANALYST_SINGLE: 'シングルバッファ',
  BUFFER_ANALYST_MULTIPLE: 'マルチバッファ',
  OVERLAY_ANALYSIS: 'オーバーレイ解析',
  THIESSEN_POLYGON: 'ボロノイ図',
  MEASURE_DISTANCE: '距離計算',
  ONLINE_ANALYSIS: 'オンライン解析',
  INTERPOLATION_ANALYSIS: '補間解析',

  OPTIMAL_PATH: 'ルート解析',
  CONNECTIVITY_ANALYSIS: '連結解析',
  FIND_TSP_PATH: '巡回ルート解析',
  TRACING_ANALYSIS: 'トレース解析',
}

const Analyst_Methods = {
  CLIP: 'クリップ',
  UNION: 'ユニオン',
  ERASE: 'イレース',
  INTERSECT: 'インターセクション',
  IDENTITY: 'アイデンティティ',
  XOR: 'シンメトリック',
  UPDATE: '更新',

  DENSITY: '密度解析',
  AGGREGATE_POINTS_ANALYSIS: 'ポイントの集計解析',
}

const Analyst_Labels = {
  ANALYST: '解析',
  CONFIRM: 'OK',
  RESET: 'リセット',
  CANCEL: 'キャンセル',
  NEXT: '次へ',
  PREVIOUS: '前へ',
  ADD: '追加',
  Edit: '変更',

  // local
  USE_AN_EXISTING_NETWORK_DATASET: '現在ネットワークデータセットを使用',
  BUILD_A_NETWORK_DATASET: '新規2Dネットワークデータセット',
  CHOOSE_DATA: 'データの選択',
  TOPOLOGY: 'トポロジでネットワークの作成',
  ADD_DATASET: 'データセットの追加',
  DONE: 'OK',
  RESULT_FIELDS: 'フィールド設定',
  SPLIT_SETTINGS: '切断設定',
  SPLIT_LINE_BY_POINT: 'ポイントで自動ライン切断',
  SPLIT_LINES_AT_INTERSECTION: 'ラインで自動ライン切断',

  SET_START_STATION: '起点の設定',
  MIDDLE_STATIONS: '経由地点の追加',
  SET_END_STATION: '終点の設定',
  LOCATION: '選択位置',
  SET_AS_START_STATION: '起点の設定',
  SET_AS_END_STATION: '終点の設定',
  ADD_STATIONS: 'ステーションの追加',
  ADD_BARRIER_NODES: 'バリアノードの追加',
  ADD_NODES: '頂点の追加',
  UPSTREAM_TRACKING: '上流トレース',
  DOWNSTREAM_TRACKING: '下流トレース',
  CLEAR: 'クリア',
  START_STATION: '起点',
  MIDDLE_STATION: '経由地点',
  END_STATION: '終点',
  BARRIER_NODE: 'バリアノード',
  NODE: 'ステーション',

  BUFFER_ZONE: 'バッファ',
  MULTI_BUFFER_ZONE: 'マルチバッファ',
  DATA_SOURCE: 'データソース',
  DATA_SET: 'データセット',
  SELECTED_OBJ_ONLY: '選択オブジェクトのみバッファ生成',
  BUFFER_TYPE: 'バッファタイプ',
  BUFFER_ROUND: '円形バッファ',
  BUFFER_FLAT: '矩形バッファ',
  BUFFER_RADIUS: 'バッファ半径',
  RESULT_SETTINGS: '結果設定',
  BUFFER_UNION: 'バッファのユニオン',
  KEEP_ATTRIBUTES: '元オブジェクトフィールド属性を保留',
  DISPLAY_IN_MAP: 'マップで表示',
  DISPLAY_IN_SCENE: 'シーンで表示',
  SEMICIRCLE_SEGMENTS: 'セグメント数',
  RING_BUFFER: '環状バッファの生成',
  RESULT_DATA: '結果データ',
  BATCH_ADD: 'バッチ追加',
  START_VALUE: '開始値',
  END_VALUE: '終了値',
  STEP: 'ステップ',
  RANGE_COUNT: '段階数',
  INSERT: '挿入',
  DELETE: '削除',
  INDEX: '番号',
  RADIUS: '半径',
  RESULT_DATASET_NAME: '結果データセット名',
  GO_TO_SET: '設定',

  SOURCE_DATA: '元データ',
  OVERLAY_DATASET: 'オーバーレイデータ',
  SET_FIELDS: 'フィールド設定',
  FIELD_NAME: 'フィールド名',

  ISERVER_LOGIN: 'iServerにログイン',
  ISERVER: 'iServerサービスアドレス',
  SOURCE_DATASET: '元データ',

  ANALYSIS_PARAMS: '解析パラメータ',
  ANALYSIS_METHOD: '解析方法',
  Mesh_Type: 'グリッド面タイプ',
  WEIGHT_FIELD: '重みフィールド',
  ANALYSIS_BOUNDS: '解析範囲',
  MESH_SIZE: 'グリッドサイズ',
  SEARCH_RADIUS: '検索半径',
  AREA_UNIT: '面積単位',
  STATISTIC_MODE: '統計モード',
  NUMERIC_PRECISION: '数字精度',
  AGGREGATE_TYPE: '集計タイプ',

  THEMATIC_PARAMS: '主題図パラメータ',
  INTERVAL_MODE: '区分モード',
  NUMBER_OF_SEGMENTS: '区分数',
  COLOR_GRADIENT: 'カラーグラデーションモード',

  Input_Type: '入力方式',
  Dataset: 'データセット',

  NOT_SET: '未設定',
  ALREADY_SET: '設定済み',

  ADD_WEIGHT_STATISTIC: '重みフィールドの追加',

  // 方向
  LEFT: '左',
  DOWN: '下',
  RIGHT: '右',
  UP: '上',

  // 邻近解析
  DISPLAY_REGION_SETTINGS: '表示エリアの設定',
  CUSTOM_LOCALE: 'カスタムゾーン',
  SELECT_REGION: 'ポリゴンを選択',
  DRAW_REGION: 'ポリゴンを描画',
  MEASURE_DISTANCE: '距離計算',
  REFERENCE_DATASET: '参照データ',
  PARAMETER_SETTINGS: 'パラメータ設定',
  MEASURE_TYPE: '計算方式',
  MIN_DISTANCE_2: '最近距離',
  DISTANCE_IN_RANGE: '範囲内距離',
  QUERY_RANGE: 'クエリ範囲',
  MIN_DISTANCE: '最小距離',
  MAX_DISTANCE: '最大距離',
  ASSOCIATE_BROWSING_RESULT: '結果の連動表示',

  // 補間解析
  INTERPOLATION_METHOD: '補間方法',
  INTERPOLATION_FIELD: '補間フィールド',
  SCALE_FACTOR: 'ズーム係数',
  RESOLUTION: '解像度',
  PIXEL_FORMAT: 'ピクセルフォーマット',
  INTERPOLATION_BOUNDS: '補間範囲',
  SAMPLE_POINT_SETTINGS: 'サンプルポイント検索設定設定',
  SEARCH_MODE: '検索モード',
  MAX_RADIUS: '最大半径',
  SEARCH_RADIUS_2: '検索半径',
  SEARCH_POINT_COUNT: '検索点数',
  MIX_COUNT: '最小点数',
  MOST_INVOLVED: '最大点数',
  MOST_IN_BLOCK: 'ブロック内最大点数',
  OTHER_PARAMETERS: '他のパラメータ',
  POWER: '冪数',
  TENSION: 'テンション係数',
  SMOOTHNESS: 'スムーズ係数',
  SEMIVARIOGRAM: 'セミバリオグラム',
  ROTATION: '回転角度',
  SILL: 'シル値',
  RANGE: '自己相関閾値',
  NUGGET_EFFECT: 'ナゲット効果値',
  MEAN: '平均値',
  EXPONENT: '階数',
  HISTOGRAM: 'ヒストグラム',
  FUNCTION: '変換関数',
  SHOW_STATISTICS: '統計情報の表示',
  EXPORT_TO_ALBUM: 'アルバムに保存',
}

const Analyst_Params = {
  // バッファ解析
  BUFFER_LEFT_AND_RIGHT: '両側バッファ',
  BUFFER_LEFT: '左バッファ',
  BUFFER_RIGHT: '右バッファ',

  // 解析方法
  SIMPLE_DENSITY_ANALYSIS: '点密度解析',
  KERNEL_DENSITY_ANALYSIS: 'カーネル密度解析結果',

  // グリッド面タイプ
  QUADRILATERAL_MESH: 'グリッド',
  HEXAGONAL_MESH: '蜂の巣',

  // 区分モード
  EQUIDISTANT_INTERVAL: '等距離区分',
  LOGARITHMIC_INTERVAL: '対数区分',
  QUANTILE_INTERVAL: '等級段階区分',
  SQUARE_ROOT_INTERVAL: '平方根区分',
  STANDARD_DEVIATION_INTERVAL: '標準偏差区分',

  // 长度単位
  METER: 'メートル',
  KILOMETER: 'キロメートル',
  YARD: 'ヤード',
  FOOT: 'フィート',
  MILE: 'マイル',

  // 面積単位
  SQUARE_MILE: '平方マイル',
  SQUARE_METER: '平方メートル',
  SQUARE_KILOMETER: '平方キロメートル',
  HECTARE: 'ヘクタール(ha)',
  ARE: 'アール(a)',
  ACRE: 'エーカー',
  SQUARE_FOOT: '平方フィート',
  SQUARE_YARD: '平方ヤード',

  // カラーグラデーションモード
  GREEN_ORANGE_PURPLE_GRADIENT: '緑/橙/紫グラデーション',
  GREEN_ORANGE_RED_GRADIENT: '緑/橙/赤グラデーション',
  RAINBOW_COLOR: '緑/橙/赤グラデーション',
  SPECTRAL_GRADIENT: 'スペクトルグラデーション',
  TERRAIN_GRADIENT: '地形グラデーション',

  // 統計モード
  MAX: '最大値',
  MIN: '最小値',
  AVERAGE: '平均値',
  SUM: '合計',
  VARIANCE: '分散',
  STANDARD_DEVIATION: '標準偏差',

  // 集計タイプ
  AGGREGATE_WITH_GRID: 'グリッド面の集計解析',
  AGGREGATE_WITH_REGION: 'ポリゴンの集計解析',

  // 補間方法
  IDW: '逆距離加重法',
  SPLINE: 'スプライン',
  ORDINARY_KRIGING: '通常クリギング法',
  SIMPLE_KRIGING: '単純クリギング法',
  UNIVERSAL_KRIGING: '普遍クリギング法',

  // ピクセルフォーマット
  UBIT1: '符号なし1 ビット',
  UBIT16: '16ビット',
  UBIT32: '32ビット',
  SINGLE: '単精度フロート',
  DOUBLE: '倍精度フロート',

  // 查找方法
  SEARCH_VARIABLE_LENGTH: '変数検索',
  SEARCH_FIXED_LENGTH: '定数検索',
  SEARCH_BLOCK: '块查找',

  // セミバリオグラム
  SPHERICAL: '球関数	',
  EXPONENTIAL: '指数関数',
  GAUSSIAN: 'ガウス関数',
}

const Analyst_Prompt = {
  ANALYSING: '解析中',
  ANALYSIS_START: '解析開始',
  ANALYSIS_SUCCESS: '解析に成功しました',
  ANALYSIS_FAIL: '解析に失敗しました',
  PLEASE_CONNECT_TO_ISERVER: 'iServerサーバーに接続してください',
  PLEASE_CHOOSE_INPUT_METHOD: '入力方式を選択してください',
  PLEASE_CHOOSE_DATASET: 'データセットを選択してください',
  LOGIN_ISERVER_FAILED:
    'iServerサーバーに接続のに失敗しました。ipアドレスとユーザー名、パスワードを確認してください',
  BEING_ANALYZED: '解析中',
  ANALYZING_FAILED: '解析に失敗しました',
  LOADING_MODULE: 'モジュールをロード中',
  LOADING_MODULE_FAILED:
    'モジュールのロードに失敗しました。データセットを確認してください。',
  TWO_NODES_ARE_CONNECTED: 'ノード連結しています',
  TWO_NODES_ARE_NOT_CONNECTED: 'ノード連結していません。',
  NOT_FIND_SUITABLE_PATH: '適当なルートは見つかりません。',
  SELECT_DATA_SOURCE_FIRST: 'データソースを選択してください',
  SELECT_DATA_SET_FIRST: 'データセットを選択してください',
  PLEASE_SELECT_A_REGION: '1つのポリゴンを選択してください',
}

export {
  Analyst_Modules,
  Analyst_Methods,
  Analyst_Labels,
  Analyst_Params,
  Analyst_Prompt,
}
