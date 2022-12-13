// import cloneDeep from 'lodash.clonedeep'

export default function resetStore({ store }) {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  store.$reset = () => store.$patch(JSON.parse(JSON.stringify(initialState)))
}
