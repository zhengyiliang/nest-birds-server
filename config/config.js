module.exports = {
  defaultPassword: 'z12345',
  paginate: {
    pageDefault: 1,     // 默认页码
    pageSizeDefault: 10    // 默认一页的数量
  },
  // JWT
  security: {
    // secretKey 需要比较复杂的字符串
    secretKey: 'secretKey',
    accessExp: 60 * 60,  // 1h
    // accessExp: 20,  // 20s 测试令牌过期
    // refreshExp 设置refresh_token的过期时间，默认一个月
    refreshExp: 60 * 60 * 24 * 30,
  },
  // 文件上传
  file: {
    singleLimit: 1024 * 1024 * 2, // 单个文件大小限制
    totalLimit: 1024 * 1024 * 20, // 多个文件大小限制
    count: 10,                    // 单次最大上传数量
    exclude: []                   // 禁止上传格式
    // include:[]
  },
  // 阿里云os相关配置
  'ali-oss': {
    endPoint: '',
    bucket: '',
    region: '', // 公共云下OSS Region
    accessKeyId: '',  // AccessKey ID
    accessKeySecret: '',  // AccessKey Secret
  },
}
