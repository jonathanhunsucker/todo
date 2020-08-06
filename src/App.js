import React, { useState, useReducer, useEffect } from 'react'
import './App.css'
import { TODO, DONE } from './status'

function App() {
  const [storedState, setStoredState] = useLocalStorage({})

  const [state, dispatch] = useReducer(reducer, storedState)

  useEffect(() => {
    setStoredState(state)
  }, [setStoredState, state])

  const {
    items = [],
    page = {
      id: 'INDEX',
      params: {},
    },
  } = state

  return (
    <div className="App">
      {page.id === 'INDEX' && <Index items={items} dispatch={dispatch} />}
      {page.id === 'ITEM' && <Item item={items.filter((item) => item.id === page.params.itemId)[0]} dispatch={dispatch} />}
    </div>
  )
}

function Index({ items, dispatch }) {
  return (
    <Stack>
      <div>
        <Button onClick={() => dispatch({ type: 'ADD_ITEM' })}>new</Button>
      </div>
      <Stack gap={1}>
        <h3>TODO</h3>
        <ItemLinkList items={items.filter((item) => item.status !== DONE)} dispatch={dispatch} />
      </Stack>
      <Stack gap={1}>
        <h3>DONE</h3>
        <ItemLinkList items={items.filter((item) => item.status === DONE)} dispatch={dispatch} />
      </Stack>
    </Stack>
  )
}

function ItemLinkList({ items, dispatch }) {
  return (
    <Stack gap={1}>
      {items.map((item) => (<ItemLink key={item.id} item={item} dispatch={dispatch} />))}
      {items.length === 0 && <div>None</div>}
    </Stack>
  )
}

function Item({ item, dispatch }) {
  return (
    <Stack>
      <div> 
        <Button onClick={() => dispatch({ type: 'GOTO', page: 'INDEX' })}>back</Button>
      </div>
      {item && <ItemEditor item={item} dispatch={dispatch} />}
    </Stack>
  )
}

function ItemLink({ item, dispatch }) {
  return (
    <div>
      <div>
        <button
          style={{
            fontFamily: 'serif',
            border: '0',
            fontSize: '1em',
            background: 'transparent',
            margin: '0',
            padding: '0',
            textDecoration: 'underline',
            color: 'blue',
            textAlign: 'left',
          }}
          onClick={() => dispatch({ type: 'GOTO', page: 'ITEM', params: { itemId: item.id } })}
        >
          {item.title}
        </button>
      </div>
    </div>
  )
}

function ItemEditor({ item, dispatch }) {
  return (
    <Stack>
      {item.status !== DONE && <div><Button onClick={() => dispatch({ type: 'MARK_AS', itemId: item.id, status: DONE })}>mark as done</Button></div>}
      {item.status === DONE && <div><Button onClick={() => dispatch({ type: 'MARK_AS', itemId: item.id, status: TODO })}>mark as todo</Button></div>}
      <div>
        <textarea
          style={{
            resize: 'vertical',
            width: '100%',
            minHeight: '20em',
          }}
          value={item.title}
          onChange={(e) => dispatch({ type: 'SET_ITEM_TITLE', itemId: item.id, value: e.target.value })}
        />
      </div>
      <div><Button onClick={() => window.confirm('Are you sure?') && dispatch({ type: 'REMOVE_ITEM', itemId: item.id })}>delete...</Button></div>
    </Stack>
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
    items: [...(state.items || []), { id: generateRandomId(), title: 'untitled' }],
  }),
  SET_ITEM_TITLE: (state, { itemId, value }) => ({
    ...state,
    items: state.items.map((item) => item.id === itemId ? { ...item, title: value } : item),
  }),
  REMOVE_ITEM: (state, { itemId }) => ({
    ...state,
    items: state.items.filter((item) => item.id !== itemId),
  }),
  MARK_AS: (state, { itemId, status }) => ({
    ...state,
    items: state.items.map((item) => item.id === itemId ? { ...item, status } : item),
  }),
  GOTO: (state, { page, params }) => ({
    ...state,
    page: { id: page, params },
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

function Button({ ...props }) {
  return (
    <button
      style={{
        padding: '0.5em 1em',
        background: 'white',
        border: '1px solid grey',
        borderRadius: '0.25em',
        margin: 0,
      }}
      {...props}
    />
  )
}

function Stack({ gap = 2, ...props }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: `${gap / 2}em`,
      }}
      {...props}
    />
  )
}

export default App
