
import { useEffect, useState } from "react";
import {
  Button,
  EditableText,
  InputGroup,
  Toaster,
  Position,
} from "@blueprintjs/core"
import "./styles.css"

const AppToaster = Toaster.create({
  position: Position.TOP,
})

function App() {
  const [users, setUsers] = useState([])
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
 

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(json => setUsers(json))
  }, [])
//add a new user
  const addUser = () => {
    const name = newName.trim()
    const phone = newPhone.trim()
    if (name && phone) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(response => response.json())
        .then(data => {
          setUsers([...users, data])
          setNewName("")
          setNewPhone("")
         
          AppToaster.show({
            message: "User added successfully",
            intent: "success",
            timeout: 3000,
          })
        })
    }
  }

  const updateUser = id => {
    const user = users.find(user => user.id === id)

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response => response.json())
      .then(() => {
        AppToaster.show({
          message: "User updated successfully",
          intent: "success",
          timeout: 3000,
        })
      })
  }

  const deleteUser = id => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(() => {
        setUsers(values => {
          return values.filter(item => item.id !== id)
        })
        AppToaster.show({
          message: "User deleted successfully",
          intent: "success",
          timeout: 3000,
        })
      })
  }

  const onChangeHandler = (id, key, value) => {
    setUsers(values => {
      return values.map(item =>
        item.id === id ? { ...item, [key]: value } : item
      )
    })
  }

  return (
    <div className="App">
      <table class="bp4-html-table .modifier">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  value={user.Phone}
                  onChange={value => onChangeHandler(user.id, "email", value)}
                />
              </td>
             
              <td>
                <Button intent="primary" onClick={() => updateUser(user.id)}>
                  Update
                </Button>
                &nbsp;
                <Button intent="danger" onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Add name here..."
              />
            </td>
            <td>
              <InputGroup
                placeholder="Add phone here..."
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
              />
            </td>
           
            <td>
              <Button intent="success" onClick={addUser}>
                Add user
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default App