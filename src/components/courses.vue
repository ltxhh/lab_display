<template>
  <div>
    <lab_head />
    <lab_header />
    <div class="container layout layout-margin-top">
      <div class="row">
        <div class="col-md-9 layout-body">
          <div class="content">
            <div class="row course-cates">
              <div class="col-md-1 course-cates-title">类别：</div>
              <div class="col-md-11 course-cates-content">
                <a class="active" href="javascript:;" @click="get_courses()">全部</a>
                        <a class="" href="javascript:;"  @click="add_type('free',1)" >{{course_type_list[0].title}}</a>
                        <a class="" href="javascript:;" @click="add_type('free',2)">{{course_type_list[1].title}}</a>
                        <div class="course-cates-vip ">
                            <a target="_blank" href="javascript:;"><img src="/static/img/vip-icon.png"></a>
                            <a class=""  @click="add_type('free',3)">{{course_type_list[2].title}}</a>
                        </div>
                    </div>
            </div>
            <div class="row course-cates">
              <div class="col-md-1 course-cates-title">标签：</div>
              <div class="col-md-11 course-cates-content">
                <a class="active" href="javascript:;" @click="get_courses()" >全部</a>
                <a v-for="(item, index) in tagslist" :key="index">
                  <a class="" href="javascript:;" @click="add_type('tag_id',item.id)">{{item.title}}</a>
                </a>
              </div>
            </div>
          </div>
          <div class="content position-relative">
            <!--
                <ul class="nav nav-tabs" role="tablist">
                    <li class="active"><a href="/courses/?course_type=all&amp;tag=all&amp;fee=all" @click="get_kind_courses()">已上线</a></li>
                    <li class=""><a href="/courses/?status=preview" class="stat-event" data-stat="preview_course" @click="get_is_online('即将上线')">即将上线</a></li>
                    <li class="active"><a href="javascript:void(0);" @click="set_isonline(0)">全部</a></li>
                    <li class=""><a href="#"  @click="set_isonline(1)">已上线</a></li>
                    <li class=""><a href="javascript:void(0);" class="" data-stat="" @click="set_isonline(2)">即将上线</a></li>
                </ul>  -->

            <ul class="nav nav-tabs" role="tablist">
              <li class="active">
                <a href="javascript:void(0);" @click="add_type('online', '')"
                  >全部</a
                >
              </li>
              <li class="">
                <a href="javascript:void(0);" @click="add_type('online', '1')"
                  >已上线</a
                >
              </li>
              <li class="">
                <a
                  href="javascript:void(0);"
                  class="stat-event"
                  data-stat="preview_course"
                  @click="add_type('online', '0')"
                  >即将上线</a
                >
              </li>
            </ul>
            <div class="clearfix"></div>
            <div class="courses-sort">
              <a href="javascript:void(0);" @click="add_type('sort', '')"
                >最新</a
              >
              /
              <a href="javascript:void(0);" @click="add_type('sort', '2')"
                >最热</a
              >
            </div>
            <div class="search-result"></div>
            <div class="row">
              <div
                class="col-md-4 col-sm-6 course"
                v-for="(item, index) in courselist"
                :key="index"
              >
                <router-link
                  :to="{
                    path: '/courses/course_show/',
                    query: { id: item.id },
                  }"
                >
                  <div class="course-box">
                    <div class="sign-box">
                      <i
                        class="fa fa-star-o course-follow pull-right"
                        data-follow-url="/courses/63/follow"
                        data-unfollow-url="/courses/63/follow"
                        style="display: none"
                      ></i>
                    </div>
                    <div>
                      <div class="course-img">
                        <img :src="item.img_path" class="cover-image" />
                      </div>
                      <div class="course-body">
                        <span
                          class="course-title"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          >{{ item.title }}</span
                        >
                      </div>
                      <div class="course-footer">
                        <span class="course-per-num pull-left">
                          <i class="fa fa-users"></i>{{ item.learner }}
                        </span>
                        <span
                          class="course-money pull-right"
                          style="background: #cfcfcf"
                          v-if="item.course_type == 1"
                          >免费</span
                        >
                        <span
                          class="course-money pull-right"
                          style="background: #87ceeb"
                          v-if="item.course_type == 2"
                          >限免}</span
                        >
                        <span
                          class="course-money pull-right"
                          v-if="item.course_type == 3"
                          >会员</span
                        >
                        <span
                          class="course-money pull-right"
                          style="background: #ff6666"
                          v-if="item.course_type == 4"
                          >训练营</span
                        >
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          <table style="clear: both"></table>
          <nav class="pagination-container">
            <!-- heyui分页 -->
            <div style="margin-left: 650px">
              <Pagination
                @change="change"
                v-model="pagination"
                layout="pager,jumper"
                small
              ></Pagination>
            </div>
          </nav>
        </div>
        <div class="col-md-3 layout-side">
          <user_info />
          <last_paths />
          <QR_code />
        </div>
      </div>
    </div>

    <lab_footer />
  </div>
</template>

<script>
import lab_head from "./common/lab_head";
import lab_header from "./common/lab_header";
import lab_footer from "./common/lab_footer";
import user_info from "./common/user_info";
import last_paths from "./common/last_paths";
import QR_code from "./common/QR_code";
import { getcourses1_get, gettags_get, courses_type } from "./axios_api/api";
import { config, formatXml } from "../config.js";
export default {
  data() {
    return {
      // 分页器变量
      pagination: {
        page: 1,
        size: 6,
        total: "",
      },
      courselist: "",
      tagslist: "",
      course_type_list: '',
      tag: "",
      is_online: "",
      activetype: {
        free: "",
        tag_id: "",
        online: "",
        sort: "",
      },
    };
  },
  components: {
    lab_head,
    lab_header,
    lab_footer,
    user_info,
    last_paths,
    QR_code,
  },
  mounted: function () {
    localStorage["activetype"] = JSON.stringify({
      free: "",
      tag_id: "",
      online: "",
      sort: "",
    });
    this.get_courses();
    this.get_tags();
    this.get_course_type()
  },

  methods: {
    // course_img(img) {
    //   if (img == "course.jpg") {
    //     return config["baseurl"] + "static/upload/" + img;
    //   } else {
    //     return config["qiniuurl"] + img;
    //   }
    // },
    add_type(type, value) {
      this.activetype[type] = value;
      localStorage["activetype"] = JSON.stringify(this.activetype);
      this.get_courses();
    },

    // 分页器
    change() {
      var get_activetype = localStorage.getItem("activetype");
      var parms = JSON.parse(get_activetype);
      var params = {
        page: this.pagination.page,
        size: this.pagination.size,
        tag_id: parms["tag_id"],
        free: parms["free"],
        online: parms["online"],
        sort: parms["sort"],
      };
      getcourses1_get(params).then((resp) => {
        this.courselist = resp.data;
      });
    },

    //   获取所有课程
    get_courses() {
      var get_activetype = localStorage.getItem("activetype");
      console.log(get_activetype);
      var parms = JSON.parse(get_activetype);
      console.log(parms);
      var data = {
        page: this.pagination.page,
        size: this.pagination.size,
        tag_id: parms["tag_id"],
        free: parms["free"],
        online: parms["online"],
        sort: parms["sort"],
      };
      getcourses1_get(data).then((resp) => {
        console.log(resp.data);
        this.courselist = resp.data;
        this.pagination.total = resp.total;
      });
    },

    // 获取标签
    get_tags() {
      gettags_get()
        .then((res) => {
          this.tagslist = res.data;
        })
        .catch((err) => {
          alert("error");
        });
    },
    //获取课程类型
    get_course_type(){
      courses_type()
      .then((res)=>{
        this.course_type_list = res.data
      })
      .catch((err)=>{
        alert('error')
      })
    }
  },
};
</script>

<style>
</style>
