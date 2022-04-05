<template>
  <div>
    <!-- <el-form-item label="上传视频"> -->
      <el-upload
        action="http://up-z2.qiniup.com"
        :on-success="uploadSuccess"
        :data="QNToken"
      >
        <button size="small" type="primary">点击上传</button>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件,且不超过500kb
        </div>
      </el-upload>
    <!-- </el-form-item> -->
  </div>
</template>

<script>
import { qn_back } from "@/components/axios_api/api.js";
export default {
  data() {
    return {
      imageUrl: "",
      QNToken:{
        token:''
      }
    };
  },
  methods: {
    GetQNToken() {
      qn_back()
        .then((res) => {
          console.log(res.token)
          this.QNToken.token = res.token;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadSuccess(res, file) {
      console.log("img", res.key);
      this.imageUrl = "http://r9ozooa8d.hn-bkt.clouddn.com/" + res.key;
      console.log("image>>", this.imageUrl);
    },
  },
  mounted() {
    this.GetQNToken();
  },
};
</script>

<style>
</style>
