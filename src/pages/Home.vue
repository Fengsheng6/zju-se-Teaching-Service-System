<template>
  <div>
    <!-- <h1>Home Page</h1> -->
    <!-- 其他内容 -->
  </div>
  <!-- 页面卡片显示区 -->
  <div style="display: flex;flex-wrap: wrap; justify-content: start;">

    
    <el-button class="cardBox" @click="goToUploadResource()" v-if="user == 'student'">
      <div>
        <div style="font-size: 28px;font-weight: bold;">课程资源上传</div>
        <el-divider />
        <el-icon size="150px" color="pink"><Collection /></el-icon>
      </div>
    </el-button>
    <el-button class="cardBox" @click="goToUploadResource()" v-if="user == 'teacher'">
      <div>
        <div style="font-size: 28px;font-weight: bold;">课程资源上传</div>
        <el-divider />
        <el-icon size="150px" color="pink"><Collection /></el-icon>
      </div>
    </el-button>
    <el-button class="cardBox" @click="goToviewResource()" v-if="user == 'student'">
      <div>
        <div style="font-size: 28px;font-weight: bold;">课程资源查看</div>
        <el-divider />
        <el-icon size="150px" color="pink"><Collection /></el-icon>
      </div>
    </el-button>
    <el-button class="cardBox" @click="goToviewResource()" v-if="user == 'teacher'">
      <div>
        <div style="font-size: 28px;font-weight: bold;">课程资源查看</div>
        <el-divider />
        <el-icon size="150px" color="pink"><Collection /></el-icon>
      </div>
    </el-button>

    <el-button class="cardBox" @click="goToHomework()" v-if="user == 'student'">
      <div>
        <div style="font-size: 28px;font-weight: bold;">作业</div>
        <el-divider />
        <el-icon size="150px" color="pink"><Collection /></el-icon>
      </div>
    </el-button>

    <el-button class="cardBox" @click="goToHomeworkTeacher()" v-if="user == 'teacher'">
      <div>
        <div style="font-size: 28px;font-weight: bold;">作业（教师端）</div>
        <el-divider />
        <el-icon size="150px" color="pink"><Collection /></el-icon>
      </div>
    </el-button>

    <el-button class="cardBox" @click="goToAttendance()" v-if="user == 'teacher'">
      <div>
        <div style="font-size: 28px;font-weight: bold;">考勤（教师端）</div>
        <el-divider />
        <el-icon size="150px" color="pink"><Collection /></el-icon>
      </div>
    </el-button>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const user = inject('user');
const router = useRouter();
const is_homepage = inject('is_homepage');

function goToUploadResource() {
  is_homepage.set(false);
  router.push('/uploadResource');
}

function goToviewResource() {
  is_homepage.set(false);
  router.push('/viewResource');
}

function goToHomework() {
  is_homepage.set(false);
  router.push('/homework');
}

function goToHomeworkTeacher() {
  is_homepage.set(false);
  router.push('/homeworkTeacher');
}

function goToAttendance() {
  is_homepage.set(false);
  router.push('/attendance');
}



</script>

<style scoped>
.cardBox {
    height: 300px;
    width: 200px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
    margin-top: 40px;
    margin-left: 40px;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 7.5px;
    padding-right: 10px;
    padding-top: 15px;
}
</style>