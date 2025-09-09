import { useEffect, useState } from "react";
import axios from "axios";
import {
  MdModeEditOutline,
  MdOutlineDone,
  MdOutlineDoneAll,
} from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const getTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/todos");
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault(); // to prevent page refresh after submit
    try {
      await axios.post("http://localhost:5000/todos", {
        description,
        completed: false,
      });

      setDescription("");
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: editedText,
      });
      setEditTodo(null);
      setDescription("");
      getTodos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
      getTodos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleCompleted = async (id) => {
    try {
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="min-h-screen items-center flex justify-center bg-gray-800 p-4 ">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold uppercase mb-8">PERN todo app</h1>

        <form
          onSubmit={onSubmitForm}
          className="flex items-center gap-2 shadow-sm p-2 rounded-lg mb-6"
        >
          <input
            className="flex-1 w-full outline-none px-3 py-2 text-gray-700 placeholder-gray-400 "
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What need to do?"
            required
          />
          <button className="px-4 text-white py-2 rounded-md font-medium bg-blue-500 hover:bg-blue-700 cursor-pointer">
            Add task
          </button>
        </form>
        <div>
          {todos.length === 0 ? (
            <p className="text-center text-gray-400">No todos yet</p>
          ) : (
            <div className="flex gap-4 flex-col">
              {todos.map((todo) => (
                <div className="pb-4" key={todo.todo_id}>
                  {editTodo === todo.todo_id ? (
                    <div className="flex gap-3 justify-between">
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="flex-1 p-3 border rounded-lg outline-none shadow-inner text-gray-700 focus:ring-2 focus:ring-blue-300 border-gray-200"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => saveEdit(todo.todo_id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200"
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          onClick={() => setEditTodo(null)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2 hover:bg-red-600 duration-200"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button
                          onClick={() => toggleCompleted(todo.todo_id)}
                          className={`flex-shrink-0 size-6 justify-center items-center flex rounded-full border-2 ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span>{todo.description}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditTodo(todo.todo_id);
                            setEditedText(todo.description);
                          }}
                          className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-100 duration-200"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-100 duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
