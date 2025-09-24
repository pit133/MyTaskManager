import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getColumns, getTasks, getToken, moveTask } from "../api";
import AddTaskForm from "./pageElements/TaskForms/AddTaskForm";
import Task from "./pageElements/Task";
import AddColumnForm from "./pageElements/AddColumnForm";
import Column from "./pageElements/Column";

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

  const handleColumnAdded = (newColumn) => {
    setColumns((prevColumns) => [...prevColumns, newColumn]);
  };

  const handleDeleteTask = (taskId, columnId) => {
    setColumns((columns) =>
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          : column
      )
    );
  };

  const handleDeletedColumn = (columnId) => {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.id !== columnId)
    );
  };

  const handleUpdatedColumn = (updatedColumn) => {
    setColumns((columns) =>
      columns.map((column) =>
        column.id === updatedColumn.id
          ? {
              ...column,
              title: updatedColumn.title,
            }
          : column
      )
    );
  };

  const handleUpdatedTask = (updatedTask, taskId, columnId) => {
    setColumns((columns) =>
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId ? updatedTask : task
              ),
            }
          : column
      )
    );
  };

  async function handleMoveTask(taskId, fromColumnId, toColumnId) {
    console.log(`Moving task ${taskId} from ${fromColumnId} to ${toColumnId}`);

    if (fromColumnId === toColumnId) {
      return;
    }

    try {
      setColumns((prevColumns) =>
        prevColumns.map((column) => {
          if (column.id === fromColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            };
          }
          if (column.id === toColumnId) {
            const movedTask = prevColumns
              .find((col) => col.id === fromColumnId)
              ?.tasks.find((task) => task.id === taskId);

            return movedTask
              ? {
                  ...column,
                  tasks: [...column.tasks, movedTask],
                }
              : column;
          }
          console.log("UI updated successfully");
          return column;
        })
      );

      await moveTask(taskId, toColumnId);
      console.log("Task moved on server successfully");
    } catch (error) {
      console.error("Failed to move task: ", error);
      loadBoardData()
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <AddColumnForm boardId={id} onColumnAdded={handleColumnAdded} />

      <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onColumnDeleted={handleDeletedColumn}
            onColumnUpdated={handleUpdatedColumn}
            onTaskMove={handleMoveTask}
          >
            {column.tasks?.map((task) => (
              <Task
                key={task.id}
                task={task}
                onTaskDeleted={handleDeleteTask}
                onTaskUpdated={handleUpdatedTask}
                columnId={column.id}
                onTaskMove={handleMoveTask}
              />
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
          </Column>
        ))}
      </div>
    </div>
  );
}
