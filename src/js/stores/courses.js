import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import api from "@/js/api";

export const useCoursesStore = defineStore("courses", () => {
  const authStore = useAuthStore();
  const { user } = authStore;
  const courses = ref(user.institution?.courses || []);

  const getCourses = async placeId => {
    return api
      .get(`institutions/${placeId}/courses`)
      .then(res => res.json())
      .then(data => {
        console.log(data.courses)
        courses.value = data.courses;
      });
  };

  return {
    courses,
    getCourses,
  };
});
