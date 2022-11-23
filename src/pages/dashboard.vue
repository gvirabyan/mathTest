<template>
  <f7-page class="hg-dashboard-content" name="dashboard">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false">
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>Math</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-ios="f7:square_arrow_right" icon-aurora="f7:square_arrow_right" icon-md="material:logout" @click="logout"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- Page content-->
    <answered-questions-popup />
    <active-categories-popup />

    <div class="block hg-statistics-content">
      <div class="row">
        <div class="col-100 hg-statistic-item hg-last-category-content">
          <div class="card card-content card-content-padding">
            <div class="hg-body-content">
              <i class="f7-icons hg-content-icon">graph_square</i>
              <span class="hg-content-value">Բազմապատկման աղյուսակ</span>
            </div>
            <div class="hg-content-title">Last Category</div>
          </div>
        </div>

        <div class="col-50 hg-statistic-item hg-answered-questions-content popup-open" data-popup="#answeredQuestionsPopup">
          <div class="card card-content card-content-padding">
            <div class="hg-body-content">
              <i class="f7-icons hg-content-icon">status</i>
              <span class="hg-content-value">13</span>
            </div>
            <div class="hg-content-title">Answered Questions</div>
          </div>
        </div>

        <div class="col-50 hg-statistic-item hg-experience-points-content">
          <div class="card card-content card-content-padding">
            <div class="hg-body-content">
              <i class="f7-icons hg-content-icon">grid_circle</i>
              <span class="hg-content-value">123</span>
            </div>
            <div class="hg-content-title">Experience Points</div>
          </div>
        </div>

        <div class="col-50 hg-statistic-item hg-active-categories-content popup-open" data-popup="#answeredQuestionsPopup">
          <div class="card card-content card-content-padding">
            <div class="hg-body-content">
              <i class="f7-icons hg-content-icon">graph_square</i>
              <span class="hg-content-value">2</span>
            </div>
            <div class="hg-content-title">Active Categories</div>
          </div>
        </div>

        <a class="col-50 hg-statistic-item hg-categories-list-content" href="/categories/">
          <div class="card card-content card-content-padding">
            <div class="hg-body-content">
              <i class="f7-icons hg-content-icon">qrcode</i>
              <span class="hg-content-value">2</span>
            </div>
            <div class="hg-content-title">Categories List</div>
          </div>
        </a>

      </div>
    </div>
  </f7-page>
</template>

<script>
import { useStore } from 'framework7-vue';
import store from '../js/store';
import AnsweredQuestionsPopup from '../components/answered-questions-popup.vue';
import ActiveCategoriesPopup from '../components/active-categories-popup.vue';

export default {
  name: "Home",
  props: {
    f7router: Object,
  },
  components: {
    AnsweredQuestionsPopup,
    ActiveCategoriesPopup
  },
  setup() {
    const categories = useStore('categories');

    return {
      categories
    }
  },
  data() {
    return {}
  },
  mounted() {
    store.dispatch('getCategories');
  },
  methods: {
    logout() {
      store.dispatch('logout').then(() => {
        this.f7router.navigate('/login/')
      });
    }
  }
}
</script>

<style lang="scss">
@import "../assets/scss/pages/dashboard";
</style>
