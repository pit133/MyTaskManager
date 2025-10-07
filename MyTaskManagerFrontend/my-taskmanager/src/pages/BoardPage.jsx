import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getColumns, getTasks, getToken, moveTask, reorderTask } from "../api";
import Task from "./pageElements/Task";
import AddColumnForm from "./pageElements/ColumnForms/AddColumnForm";
import Column from "./pageElements/Column";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "./pageElements/TaskModal";

export default function BoardPage() {
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [clickedTask, setClickedTask] = useState(null);
  const [clickedTaskColumn, setClickedTaskColumn] = useState(null);
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

  function handleAddedTask(columnId, newTask) {
    setColumns((columns) =>
      columns.map((column) =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  }

  function handleTaskClick(task, column) {
    setIsTaskModalOpen(true);
    setClickedTask(task);
    setClickedTaskColumn(column);
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = draggableId;
    const fromColumnId = source.droppableId;
    const toColumnId = destination.droppableId;
    const newTaskPosition = destination.index;

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];

      const sourceColumn = newColumns.find((col) => col.id === fromColumnId);
      const destColumn = newColumns.find((col) => col.id === toColumnId);

      if (!sourceColumn || !destColumn) {
        return prevColumns;
      }

      const taskToMove = sourceColumn.tasks.find((task) => task.id === taskId);

      if (!taskToMove) {
        return prevColumns;
      }

      if (fromColumnId === toColumnId) {
        const tasks = [...sourceColumn.tasks];

        tasks.splice(source.index, 1);
        tasks.splice(destination.index, 0, taskToMove);

        return newColumns.map((column) =>
          column.id === fromColumnId ? { ...column, tasks } : column
        );
      }

      const updatedSourceTasks = sourceColumn.tasks.filter(
        (task) => task.id !== taskId
      );

      const updatedDestTasks = [...destColumn.tasks];
      updatedDestTasks.splice(destination.index, 0, taskToMove);

      return newColumns.map((column) => {
        if (column.id === fromColumnId) {
          return { ...column, tasks: updatedSourceTasks };
        }
        if (column.id === toColumnId) {
          return { ...column, tasks: updatedDestTasks };
        }
        return column;
      });
    });

    try {
      if (fromColumnId === toColumnId) {
        await reorderTask(taskId, newTaskPosition);
        console.log("Task reordered successfully");
      } else {
        await moveTask(taskId, toColumnId, newTaskPosition);
        console.log("Task moved to another column successfully");
      }
    } catch (error) {
      console.error("Failed to move task: ", error);
      loadBoardData();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <Column
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  column={column}
                  isDraggingOver={snapshot.isDraggingOver}
                  onTaskAdded={handleAddedTask}
                  onColumnDeleted={handleDeletedColumn}
                  onColumnUpdated={handleUpdatedColumn}
                >
                  {column.tasks?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Task
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          task={task}
                          isDragging={snapshot.isDragging}
                          style={provided.draggableProps.style}
                          onTaskDeleted={handleDeleteTask}
                          //onTaskUpdated={handleUpdatedTask}
                          columnId={column.id}
                          onClick={() => handleTaskClick(task, column)}
                        />
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </Column>
              )}
            </Droppable>
          ))}
          <AddColumnForm boardId={id} onColumnAdded={handleColumnAdded} />
          <TaskModal
            task={clickedTask}
            column={clickedTaskColumn}
            //onTaskUpdated={handleUpdatedTask}
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
          ></TaskModal>
        </div>
      </div>
    </DragDropContext>
  );
}
