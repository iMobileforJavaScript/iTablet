const Analyst_Modules = {
  BUFFER_ANALYSIS: 'Buffer Analizi',
  BUFFER_ANALYSIS_2: 'Buffer Analizi',
  BUFFER_ANALYST_SINGLE: 'Buffer Analizi',
  BUFFER_ANALYST_MULTIPLE: 'Çoklu-Buffer Analizi',
  OVERLAY_ANALYSIS: 'Kaplama Analizi',
  THIESSEN_POLYGON: 'Thiessen Poligonu',
  MEASURE_DISTANCE: 'Mesafe Ölçme',
  ONLINE_ANALYSIS: 'Çevrimiçi Analiz',
  INTERPOLATION_ANALYSIS: 'Enterpolasyon Analizi',

  OPTIMAL_PATH: 'En uygun yol',
  CONNECTIVITY_ANALYSIS: 'Bağlantı Analizi',
  FIND_TSP_PATH: 'TSP Yolunu Bul',
  TRACING_ANALYSIS: 'İzleme Analizi',
}

const Analyst_Methods = {
  CLIP: 'Kırpma',
  UNION: 'Birleştirme',
  ERASE: 'Silme',
  INTERSECT: 'Kesişim',
  IDENTITY: 'Kimlik',
  XOR: 'XOR',
  UPDATE: 'Güncelleme',

  DENSITY: 'Yoğunluk Analizi',
  AGGREGATE_POINTS_ANALYSIS: 'Toplam Nokta Analizi',
}

const Analyst_Labels = {
  ANALYST: 'Analist',
  CONFIRM: 'Onayla',
  RESET: 'Sıfırla',
  CANCEL: 'İptal',
  NEXT: 'Sonraki',
  PREVIOUS: 'Önceki',
  ADD: 'Ekle',
  Edit: 'Düzenle',

  // local
  USE_AN_EXISTING_NETWORK_DATASET: 'Mevcut Ağ Verikümesini Kullanma',
  BUILD_A_NETWORK_DATASET: 'Ağ Veri Kümesi Oluşturma',
  CHOOSE_DATA: 'Veri Seç',
  TOPOLOGY: 'Topoloji',
  ADD_DATASET: 'Veri Kümesi Ekle',
  DONE: 'Tamamlandı',
  RESULT_FIELDS: 'Sonuç Alanları',
  SPLIT_SETTINGS: 'Bölme Ayarları',
  SPLIT_LINE_BY_POINT: 'Çizgiyi Noktayla Böl',
  SPLIT_LINES_AT_INTERSECTION: 'Kesişimde Çizgileri Böl',

  SET_START_STATION: 'Başlangıç İstasyonu Ayarla',
  MIDDLE_STATIONS: 'Orta İstasyonlar',
  SET_END_STATION: 'Bitiş İstasyonu Ayarla',
  LOCATION: 'Konum',
  SET_AS_START_STATION: 'Başlangıç İstasyonu Olarak Ayarla',
  SET_AS_END_STATION: 'Bitiş Yeri İstasyonu Ayarla',
  ADD_STATIONS: 'İstasyon Ekle',
  ADD_BARRIER_NODES: "Bariyer Nod'u Ekle",
  ADD_NODES: 'Nod Ekle',
  UPSTREAM_TRACKING: 'Sistem Giriş Takibi',
  DOWNSTREAM_TRACKING: 'Sistem Çıkış Takibi',
  CLEAR: 'Temizle',
  START_STATION: 'Başlama İstasyonu',
  MIDDLE_STATION: 'Orta İstasyonu',
  END_STATION: 'Bitiş İstasyonu',
  BARRIER_NODE: "Bariyer Nod'u",
  NODE: 'Nod',

  BUFFER_ZONE: 'Buffer',
  MULTI_BUFFER_ZONE: 'Çoklu-buffer',
  DATA_SOURCE: 'Veri Kaynağı',
  DATA_SET: 'Veri Kümesi',
  SELECTED_OBJ_ONLY: 'Sadece Seçili Nesneler',
  BUFFER_TYPE: 'Buffer Tipi',
  BUFFER_ROUND: 'Yuvarlak',
  BUFFER_FLAT: 'Düz',
  BUFFER_RADIUS: 'Yarıçap',
  RESULT_SETTINGS: 'Sonuç Ayarları',
  BUFFER_UNION: 'Buffer Birleştirme',
  KEEP_ATTRIBUTES: 'Öznitelikleri Tut',
  DISPLAY_IN_MAP: 'Haritada Göster',
  DISPLAY_IN_SCENE: 'Sahnede Göster',
  SEMICIRCLE_SEGMENTS: 'Yarım Daire Segmentleri',
  RING_BUFFER: "Buffer'ı Daire İçine Al",
  RESULT_DATA: 'Sonuç Veri',
  BATCH_ADD: 'Toplu Ekleme',
  START_VALUE: 'Başlangıç Değeri',
  END_VALUE: 'Bitiş Değeri',
  STEP: 'Adım',
  RANGE_COUNT: 'Aralık Sayısı',
  INSERT: 'Ekle',
  DELETE: 'Sil',
  INDEX: 'Dizin',
  RADIUS: 'Yarıçap',
  RESULT_DATASET_NAME: 'Sonuç Veri Kümesinin Adı',
  GO_TO_SET: 'Diziye Git',

  SOURCE_DATA: 'Kaynak Veri',
  OVERLAY_DATASET: 'Kapsama Veri Kümesi',
  SET_FIELDS: 'Alanları Ayarla',
  FIELD_NAME: 'Alan Adı',

  ISERVER_LOGIN: "iServer'a Gir",
  ISERVER: "iServer URL'si",
  SOURCE_DATASET: 'Kaynak Veri Kümesi',

  ANALYSIS_PARAMS: 'Analiz Parametreleri',
  ANALYSIS_METHOD: 'Analiz Metodu',
  Mesh_Type: 'Ağ Tipi',
  WEIGHT_FIELD: 'Ağırlık Alanı',
  ANALYSIS_BOUNDS: 'Analiz Sınırları',
  MESH_SIZE: 'Ağ Boyutu',
  SEARCH_RADIUS: 'Yarıçap',
  AREA_UNIT: 'Alan Birimleri',
  STATISTIC_MODE: 'İstatistik Modu',
  NUMERIC_PRECISION: 'Sayısal Hassasiyet',
  AGGREGATE_TYPE: 'Kümeleme Tipi',

  THEMATIC_PARAMS: 'Tematik Parametreler',
  INTERVAL_MODE: 'Aralık Modu',
  NUMBER_OF_SEGMENTS: 'Segment Sayısı',
  COLOR_GRADIENT: 'Renk Gradyan Modu',

  Input_Type: 'Giriş Tipi',
  Dataset: 'Veri Kümesi',

  NOT_SET: 'Ayarlanmadı',
  ALREADY_SET: 'Zaten Ayarlanmış',

  ADD_WEIGHT_STATISTIC: 'Ağırlıklı Alan Ekle',

  // 方向
  LEFT: 'Sol',
  DOWN: 'Aşağı',
  RIGHT: 'Sağ',
  UP: 'Yukarı',

  // 邻近分析
  DISPLAY_REGION_SETTINGS: 'Bölge Ayarlarını Göster',
  CUSTOM_LOCALE: 'Özel Yerel Ayar',
  SELECT_REGION: 'Bölge Seç',
  DRAW_REGION: 'Bölge Çiz',
  MEASURE_DISTANCE: 'Mesafe Ölçme',
  REFERENCE_DATASET: 'Referans Veri Kümesi',
  PARAMETER_SETTINGS: 'Referans Veri Kümesi',
  MEASURE_TYPE: 'Ölçü Tipi',
  MIN_DISTANCE_2: 'En Kısa Mesafe',
  DISTANCE_IN_RANGE: 'En Kısa Mesafe',
  QUERY_RANGE: 'Sorgu Aralığı',
  MIN_DISTANCE: 'En Kısa Mesafe',
  MAX_DISTANCE: 'En Uzun Mesafe',
  ASSOCIATE_BROWSING_RESULT: 'Ortak Tarama Sonucu',

  // 插值分析
  INTERPOLATION_METHOD: 'Enterpolasyon Analizi',
  INTERPOLATION_FIELD: 'Enterpolasyon Metodları',
  SCALE_FACTOR: 'Ölçek Faktörü',
  RESOLUTION: 'Çözünürlük',
  PIXEL_FORMAT: 'Piksel Formatı',
  INTERPOLATION_BOUNDS: 'Sınırlar',
  SAMPLE_POINT_SETTINGS: 'Örnek Nokta Ayarları',
  SEARCH_MODE: 'Arama Modu',
  MAX_RADIUS: 'Maksimum Yarıçap',
  SEARCH_RADIUS_2: 'Arama Yarıçapı',
  SEARCH_POINT_COUNT: 'Nokta Sayısı',
  MIX_COUNT: 'Min Sayı',
  MOST_INVOLVED: 'En Çok Dahil Olan',
  MOST_IN_BLOCK: 'Bloktaki En Çok Olan',
  OTHER_PARAMETERS: 'Diğer Parametreler',
  POWER: 'Güç',
  TENSION: 'Gerilim',
  SMOOTHNESS: 'Düzgünlük',
  SEMIVARIOGRAM: 'Yarı Varyans',
  ROTATION: 'Döndürme',
  SILL: 'Eşik',
  RANGE: 'Aralık',
  NUGGET_EFFECT: 'Kütle Etkisi',
  MEAN: 'Ortalama',
  EXPONENT: 'Katsayı',
  HISTOGRAM: 'Histogram',
  FUNCTION: 'Fonksiyon',
  SHOW_STATISTICS: 'İstatistikleri Göster',
  EXPORT_TO_ALBUM: 'Albüme Aktar',
}

const Analyst_Params = {
  // 缓冲区分析
  BUFFER_LEFT_AND_RIGHT: 'Sol ve Sağ',
  BUFFER_LEFT: 'Sol',
  BUFFER_RIGHT: 'Sağ',

  // 分析方法
  SIMPLE_DENSITY_ANALYSIS: 'Basit Yoğunluk Analizi',
  KERNEL_DENSITY_ANALYSIS: 'Kernel Yoğunluk Analizi',

  // 网格面类型
  QUADRILATERAL_MESH: 'Dörtgen Yüzey',
  HEXAGONAL_MESH: 'Altıgen Yüzey',

  // 分段模式
  EQUIDISTANT_INTERVAL: 'Eşdeğer Aralık',
  LOGARITHMIC_INTERVAL: 'Logaritmik Aralık',
  QUANTILE_INTERVAL: 'Kuantil Aralık',
  SQUARE_ROOT_INTERVAL: 'Karekök Aralık',
  STANDARD_DEVIATION_INTERVAL: 'Standart Sapma Aralığı',

  // 长度单位
  METER: 'm',
  KILOMETER: 'km',
  YARD: 'yarda',
  FOOT: 'ft',
  MILE: 'mil',

  // 面积单位
  SQUARE_MILE: 'mil²',
  SQUARE_METER: 'm²',
  SQUARE_KILOMETER: 'km²',
  HECTARE: 'hektar',
  ARE: 'are',
  ACRE: 'akre',
  SQUARE_FOOT: 'ft²',
  SQUARE_YARD: 'yd²',

  // 颜色渐变模式
  GREEN_ORANGE_PURPLE_GRADIENT: 'Yeşil Turuncu Mor Gradyan',
  GREEN_ORANGE_RED_GRADIENT: 'Yeşil Turuncu Kırmızı Gradyan',
  RAINBOW_COLOR: 'Gökkuşağı Rengi',
  SPECTRAL_GRADIENT: 'Spektral Gradyan',
  TERRAIN_GRADIENT: 'Arazi Gradyanı',

  // 统计模式
  MAX: 'Max',
  MIN: 'Min',
  AVERAGE: 'Ortalama',
  SUM: 'Toplam (Sum)',
  VARIANCE: 'Varyans',
  STANDARD_DEVIATION: 'Standart Sapma',

  // 聚合类型
  AGGREGATE_WITH_GRID: 'Gridli Kümeleme',
  AGGREGATE_WITH_REGION: 'Alanla Kümeleme',

  // 插值方法
  IDW: 'IDW',
  SPLINE: 'Spline',
  ORDINARY_KRIGING: 'Düzenli Kriging',
  SIMPLE_KRIGING: 'Basit Kriging',
  UNIVERSAL_KRIGING: 'Evrensel Kriging',

  // 像素格式
  UBIT1: 'UBIT1',
  UBIT16: 'UBIT16',
  UBIT32: 'UBIT32',
  SINGLE: 'Tek',
  DOUBLE: 'Çift',

  // 查找方法
  SEARCH_VARIABLE_LENGTH: 'Değişken Uzunluk',
  SEARCH_FIXED_LENGTH: 'Sabit Uzunluk',
  SEARCH_BLOCK: 'Blok',
  SPHERICAL: 'Küresel',
  EXPONENTIAL: 'Eksponansiyel',
  GAUSSIAN: 'Gaussian',
}

const Analyst_Prompt = {
  ANALYSING: 'Analiz Ediliyor',
  ANALYSIS_START: 'Analiz Ediliyor',
  ANALYSIS_SUCCESS: 'Başarıyla Analiz Edildi',
  ANALYSIS_FAIL: 'Analiz Başarısız Oldu',
  PLEASE_CONNECT_TO_ISERVER: 'Lüften iServer’a Bağlanın',
  PLEASE_CHOOSE_INPUT_METHOD: 'Lütfen Girdi Modelini Seçin',
  PLEASE_CHOOSE_DATASET: 'Lütfen Veri Kümesini Seçin',
  LOGIN_ISERVER_FAILED:
    'iServera bağlanamadı, lütfen ip, kullanıcı adı ve şifreyi kontrol edin',
  BEING_ANALYZED: 'Analiz Ediliyor',
  ANALYZING_FAILED: 'Analiz Başarısız',
  LOADING_MODULE: 'Modül Yükleniyor',
  LOADING_MODULE_FAILED: 'Modül yüklenemedi, lütfen veri kümesini kontrol edin',
  TWO_NODES_ARE_CONNECTED: 'İki Nod Bağlı',
  TWO_NODES_ARE_NOT_CONNECTED: 'İki Nod Bağlı Değil',
  NOT_FIND_SUITABLE_PATH: 'Uygun Erişim Yolu Bulunamadı',
  SELECT_DATA_SOURCE_FIRST: 'Lütfen önce veri kaynağını seçin',
  SELECT_DATA_SET_FIRST: 'Lütfen önce veri kümesini seçin',
  PLEASE_SELECT_A_REGION: 'Lütfen Bir Bölge Seçin',
}

export {
  Analyst_Modules,
  Analyst_Methods,
  Analyst_Labels,
  Analyst_Params,
  Analyst_Prompt,
}
