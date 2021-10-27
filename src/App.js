import { useState, useEffect } from "react";
import { BrowserRouter as Router,Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Tasks from './components/Tasks';
import AddTask from './AddTask';

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  },[])

  // fetching tasks from the json server
  const fetchTasks = async function() {
    const res = await fetch('http://localhost:5000/Tasks')
    const data = await res.json()
    // console.log(data)
    return data
  }

    // fetching a single task from the json server
    const fetchTask = async function(id) {
      const res = await fetch(`http://localhost:5000/Tasks/${id}`)
      const data = await res.json()
      
      return data
    }

    // Adding tasks to the UI from the server
    const addTask = async (task) => {
      const res = await fetch('http://localhost:5000/Tasks',{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify(task)
      })
      const data = await res.json()

      setTasks([...tasks,data])
    }

    /* const addTask = (task) => {
      const id = Math.floor(Math.random() * 10000) + 1
      const newTask = {id, ...task}
      setTasks([...tasks,newTask]) 
    } */
    

    // delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/Tasks/${id}
  `,{
    method: 'DELETE'
  })

  setTasks(tasks.filter((task) => task.id !== id))
  }

  // toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = fetchTask(id)
    const updatedTask = {...taskToToggle,reminder: !taskToToggle.reminder }

    const res = await fetch (`http://localhost:5000/Tasks${id}`,{
      method:'PUT',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) => task.id === id ? {...task, reminder : data.reminder} : task))
  }

    return (
      <Router>
      <div className='container'>
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      
      <Route path="/" exact render={(props)=> (
          <>
      {showAddTask && <AddTask  onAdd={addTask}/>}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No tasks to Show' }
          </>
      )
      } />
      <Route path="/about" component={About} />
      <Footer />
      </div>
      </Router>
    );

}


export default App;
