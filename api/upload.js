import storage from "@utils/storage";
import { uploadFullUrl } from "./index";

export const upload = (thumb) => {
  const token = `${storage.get("token_type")} ${storage.get("token")}`;

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: uploadFullUrl,
      filePath: thumb,
      name: "file",
      fileType: "image",
      formData: {
        bucketType: "ncbd",
      },
      header: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
      success: (res) => {
        try {
          res = JSON.parse(res.data);
        } catch (e) {
          reject({
            type: "minio:uploadFile",
            code: -99999,
            msg: "JSON解析错误",
          });
          console.error({
            type: "minio:uploadFile",
            code: -99999,
            msg: "JSON解析错误",
          });
        }
        if (+res.code === 200) {
          return resolve(res.data);
        } else if (+res.code === 403) {
          reject({
            type: "minio:uploadFile 403",
            code: res.code,
            msg: res.msg,
          });
          return uni.showToast({
            title: "身份失效，登录后再操作",
            icon: "none",
          });
        } else {
          reject({
            type: "minio:uploadFile",
            code: res.code,
            msg: res.msg,
          });
        }
        uni.hideLoading();
      },
      fail: (res) => {
        uni.showToast({
          title: "头像更新失败，请稍后重试",
          icon: "none",
        });
        return reject({
          type: "wx:uploadFile",
          code: -99999,
          msg: res.errMsg,
        });
      },
    });
  });
};
