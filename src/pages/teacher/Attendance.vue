<template>
    <div class="attendance-container">
      <el-card class="attendance-card">
        <template #header>
          <div class="card-header">
            <h2>考勤管理</h2>
            <el-button type="primary" @click="exportAttendance" :loading="exporting">
              导出考勤记录
            </el-button>
          </div>
        </template>
  
        <!-- 课程列表 -->
        <div v-loading="loading">
          <el-collapse v-model="activeNames">
            <el-collapse-item 
              v-for="course in courseList" 
              :key="course.course_id"
              :title="course.course_name"
              :name="course.course_id"
            >
              <!-- 考勤比例设置 -->
              <div class="attendance-weight">
                <span class="weight-label">考勤成绩比例：</span>
                <el-input-number
                  v-model="course.attendance_weight"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  :precision="2"
                  @change="(value) => handleWeightChange(course, value)"
                />
              </div>
  
              <!-- 日期选择器 -->
              <div class="date-selector">
                <el-date-picker
                  v-model="course.selectedDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disableFutureDates"
                  @change="(date) => handleDateChange(course, date)"
                />
                <el-button type="primary" @click="addAttendanceDate(course)">
                  添加考勤日期
                </el-button>
              </div>
  
              <!-- 考勤日期列表 -->
              <el-tabs v-model="course.activeDate" type="card" class="attendance-tabs">
                <el-tab-pane 
                  v-for="date in course.attendanceDates" 
                  :key="date.date"
                  :label="date.date"
                  :name="date.date"
                >
                  <!-- 考勤记录表格 -->
                  <el-table :data="date.students" style="width: 100%">
                    <el-table-column prop="student_id" label="学号" width="120" />
                    <el-table-column prop="student_name" label="姓名" width="120" />
                    <el-table-column label="出勤情况" width="300">
                      <template #default="{ row }">
                        <el-select v-model="row.attendance_status" @change="(value) => handleStatusChange(course, date, row, value)">
                          <el-option label="出勤" value="present" />
                          <el-option label="请假" value="leave" />
                          <el-option label="缺勤" value="absent" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="考勤成绩" width="150">
                      <template #default="{ row }">
                        <span>{{ getAttendanceScore(row.attendance_status) }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
          </el-collapse>
  
          <el-empty v-if="!loading && courseList.length === 0" description="暂无课程" />
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  
  // 状态管理
  const loading = ref(false)
  const exporting = ref(false)
  const activeNames = ref(['1'])
  const courseList = ref([])
  
  // 示例数据
  const exampleCourse = {
    course_id: 'CS001',
    course_name: '数据结构与算法',
    attendance_weight: 0.2,
    selectedDate: '',
    activeDate: '',
    attendanceDates: [
      {
        date: '2024-03-18',
        students: [
          {
            student_id: '2024001',
            student_name: '张三',
            attendance_status: 'present'
          },
          {
            student_id: '2024002',
            student_name: '李四',
            attendance_status: 'leave'
          },
          {
            student_id: '2024003',
            student_name: '王五',
            attendance_status: 'absent'
          }
        ]
      },
      {
        date: '2024-03-20',
        students: [
          {
            student_id: '2024001',
            student_name: '张三',
            attendance_status: 'present'
          },
          {
            student_id: '2024002',
            student_name: '李四',
            attendance_status: 'present'
          },
          {
            student_id: '2024003',
            student_name: '王五',
            attendance_status: 'leave'
          }
        ]
      }
    ]
  }
  
  // 方法
  const getCourseList = async () => {
    loading.value = true
    try {
      // 使用示例数据
      courseList.value = [exampleCourse]
      // 设置默认选中的日期
      courseList.value.forEach(course => {
        if (course.attendanceDates.length > 0) {
          course.activeDate = course.attendanceDates[0].date
        }
      })
    } catch (error) {
      console.error('获取课程列表错误:', error)
      ElMessage.error(`获取课程列表失败: ${error.message || '未知错误'}`)
    } finally {
      loading.value = false
    }
  }
  
  const disableFutureDates = (time) => {
    return time.getTime() > Date.now()
  }
  
  const handleDateChange = (course, date) => {
    course.selectedDate = date
  }
  
  const addAttendanceDate = (course) => {
    if (!course.selectedDate) {
      ElMessage.warning('请先选择日期')
      return
    }
  
    // 检查日期是否已存在
    if (course.attendanceDates.some(d => d.date === course.selectedDate)) {
      ElMessage.warning('该日期已存在考勤记录')
      return
    }
  
    // 创建新的考勤日期记录
    const newDate = {
      date: course.selectedDate,
      students: course.attendanceDates[0]?.students.map(student => ({
        student_id: student.student_id,
        student_name: student.student_name,
        attendance_status: 'present'
      })) || []
    }
  
    course.attendanceDates.push(newDate)
    course.activeDate = course.selectedDate
    course.selectedDate = ''
    
    ElMessage.success('添加考勤日期成功')
  }
  
  const handleWeightChange = async (course, value) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      ElMessage.success('考勤比例设置成功')
    } catch (error) {
      ElMessage.error(error.message || '设置考勤比例失败')
      course.attendance_weight = course._originalWeight
    }
  }
  
  const getAttendanceScore = (status) => {
    switch (status) {
      case 'present':
        return '1.0'
      case 'leave':
        return '0.5'
      case 'absent':
        return '0.0'
      default:
        return '0.0'
    }
  }
  
  const handleStatusChange = async (course, date, student, value) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      ElMessage.success('考勤状态更新成功')
    } catch (error) {
      ElMessage.error(error.message || '更新考勤状态失败')
    }
  }
  
  const exportAttendance = async () => {
    exporting.value = true
    try {
      // 模拟导出
      await new Promise(resolve => setTimeout(resolve, 1000))
      ElMessage.success('考勤记录导出成功')
    } catch (error) {
      ElMessage.error(error.message || '导出考勤记录失败')
    } finally {
      exporting.value = false
    }
  }
  
  // 生命周期钩子
  onMounted(() => {
    getCourseList()
  })
  </script>
  
  <style scoped>
  .attendance-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .attendance-card {
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
  
  .attendance-weight {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .weight-label {
    font-size: 1.1em;
    color: #606266;
  }
  
  .date-selector {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .attendance-tabs {
    margin-top: 20px;
  }
  
  :deep(.el-collapse-item__header) {
    font-size: 1.1em;
    font-weight: bold;
  }
  
  :deep(.el-input-number) {
    width: 150px;
  }
  
  :deep(.el-select) {
    width: 120px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 1em;
  }
  </style>