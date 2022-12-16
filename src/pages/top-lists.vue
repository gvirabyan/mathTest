<template>
  <f7-page name="top-lists">
    <f7-navbar title="Top Lists" back-link="Back" />

    <f7-list>
      <f7-list-item
        v-for="({ title, filter }, index) in linksList"
        :key="`menu-item_${index + 1}`"
        :link="`/top-list/${filter}/list`"
        :title="title"
      >
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
const linksList = [
  {
    title: 'World',
    filter: 'world',
  },
  {
    title: 'Country',
    filter: 'country',
  },
  {
    title: 'City',
    filter: 'city',
  },
  {
    title: 'School/University/College',
    filter: 'institution',
  },
  {
    title: 'Class/Course',
    filter: 'course',
  }
];
</script>
