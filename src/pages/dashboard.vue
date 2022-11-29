<template>
  <f7-page class="hg-dashboard-content" name="dashboard">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false">
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>Math</f7-nav-title>
    </f7-navbar>

    <!-- Page content-->
    <answered-questions-popup/>

    <active-categories-popup/>

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

        <div class="col-50 hg-statistic-item hg-answered-questions-content popup-open"
             data-popup="#answeredQuestionsPopup">
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
              <span class="hg-content-value">{{ user.points }}</span>
            </div>
            <div class="hg-content-title">Experience Points</div>
          </div>
        </div>

        <div class="col-50 hg-statistic-item hg-active-categories-content popup-open"
             data-popup="#answeredQuestionsPopup">
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
              <span class="hg-content-value">{{ categories.length }}</span>
            </div>
            <div class="hg-content-title">Categories List</div>
          </div>
        </a>
      </div>
    </div>
  </f7-page>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {useAuthStore} from '@/js/stores/auth';
import {useCategoryStore} from '@/js/stores/categories';
import AnsweredQuestionsPopup from '../components/answered-questions-popup.vue';
import ActiveCategoriesPopup from '../components/active-categories-popup.vue';

const authStore = useAuthStore();
const categoryStore = useCategoryStore();

const {user} = storeToRefs(authStore);
const {categories} = storeToRefs(categoryStore);
const {getCategories} = categoryStore;

getCategories()
</script>

<style lang="scss">
@import "../assets/scss/pages/dashboard";
</style>
