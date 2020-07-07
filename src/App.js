import React, { useState, useReducer, useEffect } from 'react'
import './App.css'

function App() {
  const [storedState, setStoredState] = useLocalStorage({})

  const [state, dispatch] = useReducer(reducer, storedState)

  useEffect(() => {
    setStoredState(state)
  }, [setStoredState, state])

  const {
    items = [],
  } = state

  return (
    <div className="App">
      {items.map((item) => (<Item key={item.id} item={item} dispatch={dispatch} />))}
      <button onClick={() => dispatch({ type: 'ADD_ITEM' })}>add</button>
    </div>
  )
}

function Item({ item, dispatch }) {
  return (
    <div>
      <input type="text" value={item.title} onChange={(e) => dispatch({ type: 'SET_ITEM_TITLE', itemId: item.id, value: e.target.value })} />
      <button onClick={() => dispatch({ type: 'REMOVE_ITEM', itemId: item.id })}>remove</button>
    </div>
  )
}

function useLocalStorage(initialValue) {
  const rawValue = localStorage.getItem('state')
  const storedState = rawValue !== null ? JSON.parse(rawValue) : initialValue
  const [state, setState] = useState(storedState)

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
  }, [state])

  return [state, setState];
}

const actions = {
  ADD_ITEM: (state) => ({
    ...state,
    items: [...(state.items || []), { id: generateRandomId(), title: '' }],
  }),
  SET_ITEM_TITLE: (state, { itemId, value }) => ({
    ...state,
    items: state.items.map((item) => item.id === itemId ? { ...item, title: value } : item),
  }),
  REMOVE_ITEM: (state, { itemId }) => ({
    ...state,
    items: state.items.filter((item) => item.id !== itemId),
  }),
}

function reducer(state, action) {
  if (actions.hasOwnProperty(action.type)) {
    return actions[action.type](state, action)
  }

  throw new Error(`Unknown action type \`${action.type}\``)
}

function generateRandomId() {
  return Math.random().toString(36).substring(7)
}

export default App
