const getAnswersList = (data, answer) => {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  const randomData = shuffled.slice(0, 4);
  if (!randomData.includes(answer)) {
    randomData[3] = answer
  }

  return [...randomData].sort(() => 0.5 - Math.random());
}

export default {
  getAnswers({ state }) {
    return getAnswersList(state.categoryAnswers, state.question?.attributes?.answer)
  }
}