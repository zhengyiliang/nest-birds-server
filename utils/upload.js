const config = require('@config')['ali-oss']
// const co = require('co');
const Path = require('path')
const OSS = require('ali-oss')
const { Forbidden, FileExtensionException } = require('@exception');
const { success } = require('@utils/util');
const multer = require('multer')//npm i multer
const MAO = require('multer-aliyun-oss');//npm install --save multer-aliyun-oss


// const uplod = multer({
//   storage: MAO({
//     config: {
//       region: 'oss-cn-shenzhen',
//       accessKeyId: '<accessKeyId>',
//       accessKeySecret: '<accessKeySecret>',
//       bucket: 'bucket'
//     },
//     destination: 'public/images'
//   })
// })

class Uploader {
  constructor(prefix) {
    this.prefix = prefix || ''
    this.client = new OSS(config);
  }

  static m(field, path) {
    const up = multer({
      storage: MAO({
        config,
        destination: (req, file, callback) => {
          const username = req.currentUser.name
          const ext = Path.extname(file.originalname)
          // |gif|svg
          if (!/\.(png|jpg|jpeg)$/.test(ext)) {
            throw new FileExtensionException(`不支持类型为${ext}的图片`)
          }
          callback(null, `/${username}${path || ''}`)
        },
      })
    })
    return up.single(field)
  }

  async upload(files) {
    // const filename = this.prefix + file.filename
    // 'object'填写上传至OSS的object名称,即不包括Bucket名称在内的Object的完整路径。
    // 'localfile'填写上传至OSS的本地文件完整路径。
    // let r1 = await client.put('object','localfile'); 
    let promises = []

    for (const file of files) {
      const { data, size } = file
      const filename = this.prefix + data.filename
      const promise = new Promise((resolve, reject) => {
        this.client.putStream(filename, data, {
          contentLength: size
        }).then(async (res) => {
          // const url = await client.signatureUrl(filename/* , { expires: null, 'process': 'image/resize,w_300' } */)
          // resolve({ ...res, url })
          resolve(res)
        }).catch(error => reject(error))
      })
      promises.push(promise)
    }

    try {
      return Promise.all(promises)
      // const result = await client.putStream(filename, file)
      // return result
    } catch (error) {
      console.log(error)
      throw new Forbidden('文件上传失败')
    }
  }

  // async single(file) {
  //   return this.client.putStream(`/`, file.stream);
  // }



  async delete(url) {
    const fileName = url.replace('http://zhengyiliang.oss-cn-beijing.aliyuncs.com', '')
    const flag = await this.client.delete(fileName)
    if (flag) {
      success('文件删除成功');
    } else {
      throw new Forbidden('文件删除失败')
    }
  }
}

module.exports = Uploader