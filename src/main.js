// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import store from './store'
import router from './router'
import 'common/scss/icon.scss'
import 'lib-flexible/flexible.js'
import {Lazyload} from 'mint-ui'

// require('./mock/mock.js')

Vue.config.productionTip = false
// Vue.use(MintUI)
Vue.use(Lazyload)

router.beforeEach((to, from, next) => {
  next(false)
  if (to.meta.requireAuth) {
    if (store.getters.sessionid) {
      next()
    } else {
      console.log('to:' + to)
      next({
        path: '/login',
        query: {
          to: to.path.substr(1),
          meetingId: to.query.meetingId,
          windsessionid: to.query.windsessionid
        }
      })
    }
  } else {
    console.log('no requireAuth')
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
})
