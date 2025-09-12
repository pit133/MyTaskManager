import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getColumns, getTasks, getToken } from "../api";
import AddTaskForm from "./pageElements/AddTaskForm";
import Task from "./pageElements/Task";
import AddColumnForm from "./pageElements/AddColumnForm";

export default function BoardPage() {
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const loadBoardData = async () => {
      try {
        setLoading(true);
        const columnsData = await getColumns(id);

        const columnsWithTasks = await Promise.all(
          columnsData.map(async (column) => {
            try {
              const tasksData = await getTasks(column.id);
              return { ...column, tasks: tasksData };
            } catch (err) {
              console.error(
                `Ошибка загрузки задач для колонки ${column.id}:`,
                err
              );
              return { ...column, tasks: [] };
            }
          })
        );

        setColumns(columnsWithTasks);
      } catch (err) {
        setError("Failed to load board data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBoardData();
  }, [id, navigate]);

  const handleColumnAdded = (newColumn) => {
    setColumns((prevColumns) => [...prevColumns, newColumn]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <AddColumnForm boadId={id} onColumnAdded={handleColumnAdded} />

      <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((column) => (
          <div
            key={column.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "250px",
              background: "#f9f9f9",
            }}
          >
            <h2>{column.title}</h2>

            {column.tasks?.map((task) => (
              <Task key={task.id} task={task} />
            ))}

            <AddTaskForm
              columnId={column.id}
              onTaskAdded={(task) => {
                setColumns((cols) =>
                  cols.map((col) =>
                    col.id === column.id
                      ? { ...col, tasks: [...(col.tasks || []), task] }
                      : col
                  )
                );
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
