<template>
  <div class="view-resource-container">
    <el-card class="resource-card">
      <template #header>
        <div class="card-header">
          <h2>课程资源查看</h2>
        </div>
      </template>

      <!-- 课程选择 -->
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px" class="search-form">
        <el-form-item label="课程ID" prop="course_id">
          <el-input v-model="formData.course_id" placeholder="请输入课程ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchResources" :loading="loading">
            查询资源
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 资源树和详情展示区 -->
      <div class="resource-content" v-if="resources.length > 0">
        <div class="resource-tree">
          <el-tree
            :data="resources"
            :props="defaultProps"
            @node-click="handleNodeClick"
            highlight-current
            node-key="resource_id"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span class="node-info" v-if="data.upload_time">
                  <el-tag size="small" type="info">{{ data.upload_time }}</el-tag>
                </span>
              </span>
            </template>
          </el-tree>
        </div>

        <!-- 资源详情 -->
        <div class="resource-detail" v-if="selectedResource">
          <el-card class="detail-card">
            <template #header>
              <div class="detail-header">
                <h3>资源详情</h3>
              </div>
            </template>
            <div class="detail-content">
              <p><strong>资源名称：</strong>{{ selectedResource.resource_name }}</p>
              <p><strong>上传时间：</strong>{{ selectedResource.upload_time }}</p>
              <p><strong>上传学生：</strong>{{ selectedResource.student_id }}</p>
              <p><strong>资源描述：</strong>{{ selectedResource.resource_description }}</p>
              <div class="download-section">
                <el-button type="primary" @click="downloadResource" :loading="downloading">
                  <el-icon><Download /></el-icon>
                  下载资源
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 无数据提示 -->
      <el-empty v-else-if="!loading" description="暂无资源数据" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getResources } from '../../api/student'

// 表单数据
const formData = reactive({
  course_id: ''
})

// 表单验证规则
const rules = {
  course_id: [
    { required: true, message: '请输入课程ID', trigger: 'blur' },
    { pattern: /^\d+$/, message: '课程ID必须为数字', trigger: 'blur' }
  ]
}

const formRef = ref(null)
const loading = ref(false)
const downloading = ref(false)
const resources = ref([])
const selectedResource = ref(null)

// 树形控件配置
const defaultProps = {
  children: 'children',
  label: 'resource_name'
}

// 示例数据
const mockResources = [
  {
    resource_id: 'chapter1',
    resource_name: '第一章：课程介绍',
    children: [
      {
        resource_id: 1,
        student_id: 1001,
        course_id: 1,
        resource_name: '1.1 课程概述',
        resource_description: '介绍课程的基本内容和学习目标',
        upload_time: '2024-03-15 10:00:00',
        file_url: '/api/resources/1'
      },
      {
        resource_id: 2,
        student_id: 1001,
        course_id: 1,
        resource_name: '1.2 教学大纲',
        resource_description: '详细的教学计划和课程安排',
        upload_time: '2024-03-15 10:30:00',
        file_url: '/api/resources/2'
      },
      {
        resource_id: 3,
        student_id: 1001,
        course_id: 1,
        resource_name: '1.3 参考资料',
        resource_description: '推荐的学习资料和参考书目',
        upload_time: '2024-03-15 11:00:00',
        file_url: '/api/resources/3'
      }
    ]
  },
  {
    resource_id: 'chapter2',
    resource_name: '第二章：基础知识',
    children: [
      {
        resource_id: 4,
        student_id: 1001,
        course_id: 1,
        resource_name: '2.1 基础概念',
        resource_description: '本章节的基础概念讲解',
        upload_time: '2024-03-15 14:00:00',
        file_url: '/api/resources/4'
      },
      {
        resource_id: 5,
        student_id: 1001,
        course_id: 1,
        resource_name: '2.2 基础练习',
        resource_description: '基础概念相关的练习题',
        upload_time: '2024-03-15 15:00:00',
        file_url: '/api/resources/5'
      }
    ]
  },
  {
    resource_id: 'chapter3',
    resource_name: '第三章：核心概念',
    children: [
      {
        resource_id: 6,
        student_id: 1002,
        course_id: 1,
        resource_name: '3.1 核心理论',
        resource_description: '本章节的核心理论讲解',
        upload_time: '2024-03-16 09:00:00',
        file_url: '/api/resources/6'
      },
      {
        resource_id: 7,
        student_id: 1002,
        course_id: 1,
        resource_name: '3.2 案例分析',
        resource_description: '核心理论的实际应用案例',
        upload_time: '2024-03-16 10:00:00',
        file_url: '/api/resources/7'
      },
      {
        resource_id: 8,
        student_id: 1002,
        course_id: 1,
        resource_name: '3.3 实践练习',
        resource_description: '核心概念相关的实践练习',
        upload_time: '2024-03-16 11:00:00',
        file_url: '/api/resources/8'
      }
    ]
  },
  {
    resource_id: 'chapter4',
    resource_name: '第四章：实践应用',
    children: [
      {
        resource_id: 9,
        student_id: 1002,
        course_id: 1,
        resource_name: '4.1 实践指南',
        resource_description: '实践应用的具体指南',
        upload_time: '2024-03-16 14:00:00',
        file_url: '/api/resources/9'
      },
      {
        resource_id: 10,
        student_id: 1002,
        course_id: 1,
        resource_name: '4.2 项目示例',
        resource_description: '完整的项目示例和解析',
        upload_time: '2024-03-16 15:00:00',
        file_url: '/api/resources/10'
      },
      {
        resource_id: 11,
        student_id: 1002,
        course_id: 1,
        resource_name: '4.3 常见问题',
        resource_description: '实践过程中常见问题及解决方案',
        upload_time: '2024-03-16 16:00:00',
        file_url: '/api/resources/11'
      }
    ]
  }
]

// 查询资源
const searchResources = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true
    
    // 如果是课程ID=1，使用示例数据
    if (formData.course_id === '1') {
      resources.value = [{
        resource_id: 'root',
        resource_name: `课程 ${formData.course_id} 的资源`,
        children: mockResources
      }]
      selectedResource.value = null
    } else {
      // 其他课程ID调用实际API
      const response = await getResources({
        course_id: Number(formData.course_id)
      })

      if (response.code === '200' && response.data) {
        resources.value = [{
          resource_id: 'root',
          resource_name: `课程 ${formData.course_id} 的资源`,
          children: response.data.resource_list
        }]
        selectedResource.value = null
      } else {
        ElMessage.error(response.message || '获取资源失败')
      }
    }
  } catch (error) {
    ElMessage.error(error.message || '查询失败，请检查输入')
  } finally {
    loading.value = false
  }
}

// 修改节点点击处理函数
const handleNodeClick = (data) => {
  // 检查是否是具体资源（有 student_id 和 course_id 的节点）
  if (data.student_id && data.course_id) {
    selectedResource.value = data
  } else {
    selectedResource.value = null
  }
}

// 下载资源
const downloadResource = async () => {
  if (!selectedResource.value) return

  try {
    downloading.value = true
    // 这里需要根据你的后端API实现下载功能
    const response = await fetch(selectedResource.value.file_url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedResource.value.resource_name
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
.view-resource-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.resource-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5em;
  color: #303133;
}

.search-form {
  margin-bottom: 20px;
}

.resource-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.resource-tree {
  flex: 1;
  min-width: 300px;
  border-right: 1px solid #EBEEF5;
  padding-right: 20px;
}

.resource-detail {
  flex: 2;
  min-width: 400px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-info {
  margin-left: 10px;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.2em;
  color: #303133;
}

.detail-content {
  padding: 10px 0;
}

.detail-content p {
  margin: 10px 0;
  line-height: 1.5;
}

.download-section {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 8px 0;
}

:deep(.el-tree-node__label) {
  white-space: normal;
  word-break: break-all;
}
</style>