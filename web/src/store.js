import Vue from 'vue'
import Vuex from 'vuex'
import { storeLocalConfig } from '@/api'
import api from '@/api/backend'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isHandleLocalFile: false, // 是否操作的是本地文件
    localConfig: {
      // 本地配置
      isZenMode: false, // 是否是禅模式
      // 是否开启节点富文本
      openNodeRichText: true,
      // 鼠标行为
      useLeftKeySelectionRightKeyDrag: false,
      // 是否显示滚动条
      isShowScrollbar: false,
      // 是否是暗黑模式
      isDark: false,
      // 是否开启AI功能
      enableAi: true
    },
    activeSidebar: '', // 当前显示的侧边栏
    isOutlineEdit: false, // 是否是大纲编辑模式
    isReadonly: false, // 是否只读
    isSourceCodeEdit: false, // 是否是源码编辑模式
    extraTextOnExport: '', // 导出时底部添加的文字
    isDragOutlineTreeNode: false, // 当前是否正在拖拽大纲树的节点
    aiConfig: {
      api: 'http://ark.cn-beijing.volces.com/api/v3/chat/completions',
      key: '',
      model: '',
      port: 3456,
      method: 'POST'
    },
    // 扩展主题列表
    extendThemeGroupList: [],
    // 内置背景图片
    bgList: [],
    // Auth
    user: JSON.parse(localStorage.getItem('mindmap_user') || 'null'),
    token: localStorage.getItem('mindmap_token') || ''
  },
  mutations: {
    // 设置操作本地文件标志位
    setIsHandleLocalFile(state, data) {
      state.isHandleLocalFile = data
    },

    // 设置本地配置
    setLocalConfig(state, data) {
      const aiConfigKeys = Object.keys(state.aiConfig)
      Object.keys(data).forEach(key => {
        if (aiConfigKeys.includes(key)) {
          state.aiConfig[key] = data[key]
        } else {
          state.localConfig[key] = data[key]
        }
      })
      storeLocalConfig({
        ...state.localConfig,
        ...state.aiConfig
      })
    },

    // 设置当前显示的侧边栏
    setActiveSidebar(state, data) {
      state.activeSidebar = data
    },

    // 设置大纲编辑模式
    setIsOutlineEdit(state, data) {
      state.isOutlineEdit = data
    },

    // 设置是否只读
    setIsReadonly(state, data) {
      state.isReadonly = data
    },

    // 设置源码编辑模式
    setIsSourceCodeEdit(state, data) {
      state.isSourceCodeEdit = data
    },

    // 设置导出时底部添加的文字
    setExtraTextOnExport(state, data) {
      state.extraTextOnExport = data
    },

    // 设置树节点拖拽
    setIsDragOutlineTreeNode(state, data) {
      state.isDragOutlineTreeNode = data
    },

    // 扩展主题列表
    setExtendThemeGroupList(state, data) {
      state.extendThemeGroupList = data
    },

    // 设置背景图片列表
    setBgList(state, data) {
      state.bgList = data
    },

    // Auth
    setUser(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('mindmap_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('mindmap_user')
      }
    },
    setToken(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('mindmap_token', token)
      } else {
        localStorage.removeItem('mindmap_token')
      }
    }
  },
  actions: {
    async login({ commit }, data) {
      const res = await api.login(data)
      if (res.data.success) {
        commit('setUser', res.data.data.user)
        commit('setToken', res.data.data.token)
      }
      return res
    },
    async register({ commit }, data) {
      const res = await api.register(data)
      if (res.data.success) {
        commit('setUser', res.data.data.user)
        commit('setToken', res.data.data.token)
      }
      return res
    },
    async logout({ commit }) {
      commit('setUser', null)
      commit('setToken', '')
      // Optional: call backend logout if endpoint exists
    },
    async getUser({ commit }) {
      try {
        const res = await api.getMe()
        if (res.data.success) {
          commit('setUser', res.data.data.user)
        }
      } catch (error) {
        // Token invalid
        commit('setUser', null)
        commit('setToken', '')
      }
    }
  }
})

export default store
