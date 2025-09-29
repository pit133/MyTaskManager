import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getColumns, getTasks, getToken, moveTask } from "../api";
import AddTaskForm from "./pageElements/TaskForms/AddTaskForm";
import Task from "./pageElements/Task";
import AddColumnForm from "./pageElements/AddColumnForm";
import Column from "./pageElements/Column";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

    console.log(`Moving task ${taskId} from ${fromColumnId} to ${toColumnId}`);

    try {      
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
                
        const sourceColumn = newColumns.find(col => col.id === fromColumnId);        
        const destColumn = newColumns.find(col => col.id === toColumnId);
        
        if (!sourceColumn || !destColumn) {
          return prevColumns;
        }
        
        const taskToMove = sourceColumn.tasks.find(task => task.id === taskId);
        
        if (!taskToMove) {
          return prevColumns;
        }
        
        const updatedSourceTasks = sourceColumn.tasks.filter(task => task.id !== taskId);
                
        const updatedDestTasks = [...destColumn.tasks];
        updatedDestTasks.splice(destination.index, 0, taskToMove);
        
        return newColumns.map(column => {
          if (column.id === fromColumnId) {
            return { ...column, tasks: updatedSourceTasks };
          }
          if (column.id === toColumnId) {
            return { ...column, tasks: updatedDestTasks };
          }
          return column;
        });
      });
      
      await moveTask(taskId, toColumnId);
      console.log("Task moved on server successfully");
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
        <AddColumnForm boardId={id} onColumnAdded={handleColumnAdded} />

        <div style={{ display: "flex", gap: "20px" }}>
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <Column
                  ref={provided.innerRef}
                  {...provided.droppableProps}                  
                  column={column}
                  isDraggingOver={snapshot.isDraggingOver}
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
                          onTaskUpdated={handleUpdatedTask}
                          columnId={column.id}                          
                        />
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

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
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
