import { f7 } from "framework7-vue";
import { useAuthStore } from "./stores/auth";
import { useQuestionsStore } from "./stores/questions";
import { useCategoryAnswerStore } from "./stores/category-answer";
import { storeToRefs } from "pinia/dist/pinia";
import configData from "../../config";

const { exceptionUrls } = configData;
const defaultOptions = () => {
  let options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (localStorage.getItem("token")) {
    options.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return options;
};

let prevUrl = "";
const get = async url => {
  const authStore = useAuthStore();
  const questionStore = useQuestionsStore();
  const categoryAnswerStore = useCategoryAnswerStore();
  const { checkLogout, user } = storeToRefs(authStore);
  const { logout } = authStore;

  const { updateUserAnsweredQuestions } = categoryAnswerStore;
  const { getQuestions, getAnsweredQuestions } = questionStore;
  const { offline, questions, categoryQuestion } = storeToRefs(questionStore);

  if (prevUrl && prevUrl.split("&")[0] === url.split("&")[0]) {
    if (window.controller) {
      window.controller.abort();
    }
    window.controller = new AbortController();
    window.signal = window.controller.signal;
  }
  prevUrl = url;
  const [request] = await Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}${url}`, { signal: window.signal, ...defaultOptions() })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw data.error;
        else if (
          !exceptionUrls.includes(url.split("?")[0].split("/").reverse()[0]) &&
          Object.keys(data).length === 0 &&
          checkLogout.value
        ) {
          f7.views.main.router.navigate("/error");
        }
        if (offline.value) {
          offline.value = false;
          getQuestions(categoryQuestion.value.id, false)
            .then(data => {
              if (data.data.results.length) {
                return data;
              } else {
                getAnsweredQuestions(categoryQuestion.value.id);
              }
            })
            .then(async data => {
              for (const question of data.data.results) {
                const answeredData = questions.value.find(r => r.id === question.id);
                if (answeredData) {
                  await updateUserAnsweredQuestions({
                    users_permissions_user: user.value.id,
                    question: answeredData.id,
                    category: categoryQuestion.value.id,
                    answer: answeredData.user_answer.answer,
                    status: answeredData.user_answer.status,
                    answer_type: "topic",
                  });
                }
              }
            })
            .catch(err => {
              offline.value = true;
            });
        }
        return data;
      })
      .catch(async err => {
        if (err.status === 401) {
          checkLogout.value = false;
          return await logout().then(() => {
            f7.views.main.router.navigate("/login/");
            return err;
          });
        } else if (
          !exceptionUrls.includes(url.split("?")[0]) &&
          err.message.indexOf("aborted") === -1 &&
          checkLogout.value
        ) {
          f7.views.main.router.navigate("/error");
        }
        return err;
      }),
  ]);
  return request;
};

const post = (url, body) =>
  fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...defaultOptions(),
    method: "POST",
    body: JSON.stringify(body),
  });

const put = (url, body) =>
  fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...defaultOptions(),
    method: "PUT",
    body: JSON.stringify(body),
  });

const remove = url =>
  fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...defaultOptions(),
    method: "DELETE",
  });
export default {
  get,
  post,
  put,
  remove,
};
