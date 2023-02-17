module.exports = {
    jwtSession:{session: false},
    mongoURI: process.env.SL_MONGO_URL ||'mongodb://localhost:27017/smart_door?authSource=admin',
    facesearchCollection: process.env.FACE_SEARCH_COLLECTION || 'FCI',
    logFilePath: ".\\logs\\log.log",
    logLevel: "debug",
    baseUrl: process.env.SL_BASE_URL || "https://sangkien.fpt.com.vn",
    // redisUrl: process.env.SL_REDIS_URL || "redis://127.0.0.1:6379",
    environment: process.env.NODE_ENV || "development",
    page_name_collection: "_PAGE",
    group_name_collection: "_GROUP",
    user_name_collection: "_USER",
    project_name_collection: "SLPROJECT",
    keyword_name_collection: "keyword",
    page_name_collection: "page",
    group_name_collection: "group",
    mail_name_collection: "email",
    inf_name_collection: "inf",
    cus_name_collection: "SLCONSUMER",
    limit_user: 1000000,
    limit_page: 500,
    limit_group: 500,
    limit_keywords: 100,
    normal_active_user_number: 5,
    vip_active_user_number: 10
};



