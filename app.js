const list = document.querySelector('ul')
const input = document.querySelector('#todoInput')
const addBtn = document.querySelector('.add-btn')
const errorMsg = document.querySelector('#errorMsg')
const filterBtns = document.querySelectorAll('.filter-btn')
const counter = document.querySelector('#todoCounter')
const darkModeBtn = document.querySelector('#darkmodebtn')

// state
let todos = JSON.parse(localStorage.getItem('todos')) || []
let editId = null

// theme
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
}

darkModeBtn.textContent =
  document.documentElement.classList.contains('dark') ? '☀️' : '🌙'

darkModeBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark')

  const isDark = document.documentElement.classList.contains('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')

  darkModeBtn.textContent = isDark ? '☀️' : '🌙'
})

// storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos))
}

// counter
function updateCounter(filter = 'all') {
  let count = todos.length

  if (filter === 'active') {
    count = todos.filter(t => !t.completed).length
  }

  if (filter === 'completed') {
    count = todos.filter(t => t.completed).length
  }

  counter.textContent = `${count} items`
}


// render
function renderTodos() {
  list.innerHTML = ''

  todos.forEach(todo => {
    const li = document.createElement('li')
    li.dataset.id = todo.id
    li.className = `flex items-center justify-between px-4 h-12 rounded shadow-sm
      ${todo.completed
        ? 'bg-gray-50 dark:bg-slate-600'
        : 'bg-white dark:bg-slate-700'
      }`

    const span = document.createElement('span')
    span.textContent = todo.text
    span.className = todo.completed
      ? 'text-gray-400 line-through'
      : 'text-gray-700 dark:text-slate-100'

    const actions = document.createElement('div')
    actions.className = 'flex gap-1'

    actions.innerHTML = `
      <button class="edit-btn p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-600">
        <svg class="w-5 h-5 fill-none stroke-current
          text-slate-500 dark:text-slate-300 hover:text-blue-500 transition">
          <use href="#icon-edit"></use>
        </svg>
      </button>

      <button class="delete-btn p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-600">
        <svg class="w-5 h-5 fill-none stroke-current
          text-slate-500 dark:text-slate-300 hover:text-red-500 transition">
          <use href="#icon-delete"></use>
        </svg>
      </button>

      <button class="complete-btn p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-600">
        <svg class="w-5 h-5 fill-none stroke-current
          text-slate-500 dark:text-slate-300 hover:text-emerald-500 transition">
          <use href="#icon-check"></use>
        </svg>
      </button>
    `

    li.append(span, actions)
    list.appendChild(li)
  })

  updateCounter()
}

// add/update
addBtn.addEventListener('click', () => {
  const value = input.value.trim()

  if (!value) {
    errorMsg.textContent = 'Please enter a task!'
    errorMsg.classList.remove('hidden')
    input.classList.add('border-red-500')
    return
  }

  errorMsg.classList.add('hidden')
  input.classList.remove('border-red-500')

  if (editId) {
    const todo = todos.find(t => t.id === editId)
    todo.text = value
    editId = null
    addBtn.textContent = 'Add'
  } else {
    todos.push({
      id: Date.now(),
      text: value,
      completed: false
    })
  }

  saveTodos()
  renderTodos()
  input.value = ''
})

// clear error
input.addEventListener('input', () => {
  errorMsg.classList.add('hidden')
  input.classList.remove('border-red-500')
})

// add todo with enter key
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addBtn.click()
})

// actions
list.addEventListener('click', e => {
  const li = e.target.closest('li')
  if (!li) return

  const id = Number(li.dataset.id)

  if (e.target.closest('.delete-btn')) {
    todos = todos.filter(todo => todo.id !== id)
  }

  if (e.target.closest('.edit-btn')) {
    const todo = todos.find(todo => todo.id === id)
    input.value = todo.text
    editId = id
    addBtn.textContent = 'Update'
    return
  }

  if (e.target.closest('.complete-btn')) {
    const todo = todos.find(todo => todo.id === id)
    todo.completed = !todo.completed
  }

  saveTodos()
  renderTodos()
})

// filtering
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter

    list.querySelectorAll('li').forEach(li => {
      const todo = todos.find(t => t.id === Number(li.dataset.id))

      if (filter === 'all') li.style.display = 'flex'
      if (filter === 'active') li.style.display = todo.completed ? 'none' : 'flex'
      if (filter === 'completed') li.style.display = todo.completed ? 'flex' : 'none'
    })

    updateCounter(filter)
  })
})

// init
renderTodos()
