module.exports = app => {
  const {
    INTEGER,
    STRING,
    JSON,
    DATE,
  } = app.Sequelize;

  const Report = app.model.define('user_report', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // ---- Base ----
    event_type:  STRING(200),
    app_key: STRING(200),
    uuid: STRING(200),
    ip: STRING(100),

    // ---- Click ----
    click_dom: STRING(100),
    click_type: STRING(100),
    click_hash: STRING(100),

    // ---- Pages ----
    view_type: STRING(100),

    // ---- Resource ----
    resource_url:  STRING(1000),
    resource_url_hash: STRING(100),

    // ---- ResourceApi ----
    response_url:  STRING(1000),
    response_url_hash: STRING(100),
    api_cost: STRING(200),
    api_method: STRING(200),
    api_response: STRING(2000),
    api_status: INTEGER,
    name: STRING(1000),
    entryType: STRING(50),
    initiatorType: STRING(50),
    nextHopProtocol: STRING(50),
    loading: INTEGER,
    prepareLoading: INTEGER,
    transferSize: INTEGER,

    // ---- Error ----
    error_msg_filename: STRING(400),
    error_msg_line: STRING(100),
    error_msg_message: STRING(2000),
    error_stack: STRING(2000),
    error_fingerprint: STRING(200),

    // ---- Report ----
    data: JSON,

    // ---- Browser ----
    referrer: STRING(500),
    referrer_hash: STRING(100),
    user_agent: STRING(500),
    platform: STRING(500),
    language: STRING(500),
    app_name: STRING(500),
    app_version: STRING(500),

    // ---- User ----
    user_id: STRING(100),
    
    // ---- DB ----
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,
    timestamps: true
  });

  return Report;
};