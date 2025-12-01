import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCurrentUserId,
  getToken,
  getCurrentUserName,
} from "../../API/authApi";
import { getColumns } from "../../API/columnApi";
import { getTasks, moveTask, reorderTask } from "../../API/taskApi";
import { getBoardMembers } from "../../API/boardMembersApi";
import Task from "./Task/Task";
import AddColumnForm from "./Column/AddColumnForm";
import Column from "./Column/Column";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "./TaskModal/TaskModal";
import BoardHeader from "./BoardHeader/BoardHeader";
import InviteModal from "./InviteModal/InviteModal";
import "./BoardPage.css";
import BoardMenu from "./BoardMenu/BoardMenu";
import { getBoardById } from "../../API/boardApi";
import {
  addBoardLabel,
  addTaskLabel,
  deleteBoardLabel,
  deleteTaskLabel,
  getBoardLabels,
  getTaskLabels,
} from "../../API/LabelApi";

export default function BoardPage() {
  const { id } = useParams();
  const [currentBoard, setCurrentBoard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [clickedTask, setClickedTask] = useState(null);
  const [clickedTaskColumn, setClickedTaskColumn] = useState(null);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [boardLabels, setBoardLabels] = useState([]);
  //const [taskLabels, setTaskLabels] = useState([])

  const loadBoardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [boardData, columnsData, membersData, boardLabelsData] =
        await Promise.all([
          getBoardById(id),
          getColumns(id),
          getBoardMembers(id),
          getBoardLabels(id),
        ]);

      setCurrentBoard(boardData);

      const columnsWithTasks = await Promise.all(
        columnsData.map(async (column) => {
          try {
            const tasksData = await getTasks(column.id);
            const tasksWithLabels = await Promise.all(
              tasksData.map(async (taskData) => {
                const taskLabelsData = await getTaskLabels(taskData.id);
                return { ...taskData, labels: taskLabelsData };
              })
            );
            return { ...column, tasks: tasksWithLabels };
          } catch (err) {
            console.error(
              `Ошибка загрузки задач для колонки ${column.id}:`,
              err
            );
            return { ...column, tasks: [] };
          }
        })
      );
      console.log("Columns: ", columnsWithTasks);
      setColumns(columnsWithTasks);

      const processedMembers = membersData.map((member) => {
        if (member.role === 0) member.role = "Owner";
        if (member.role === 1) member.role = "Admin";
        if (member.role === 2) member.role = "Member";
        return member;
      });
      setMembers(processedMembers);

      if (processedMembers.length > 0) {
        const userId = getCurrentUserId();
        const userName = getCurrentUserName();
        const userRole =
          processedMembers.find((member) => member.userId === userId)?.role ||
          "Member";
        setCurrentUser({ id: userId, name: userName, role: userRole });
      }

      console.log("Labels from API:", boardLabelsData);
      setBoardLabels(boardLabelsData || []);
    } catch (err) {
      const errorMessage = "Failed to load board data. Please try again later.";
      setError(errorMessage);
      console.error("Error loading board:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    loadBoardData();
  }, [id, navigate]);

  useEffect(() => {
    if (clickedTask && columns) {
      const updatedTask = columns
        .flatMap((column) => column.tasks)
        .find((task) => task.id === clickedTask.id);

      if (
        updatedTask &&
        JSON.stringify(updatedTask) !== JSON.stringify(clickedTask)
      ) {
        console.log("🔄 Syncing clickedTask:", updatedTask);
        setClickedTask(updatedTask);
      }
    }
  }, [columns, clickedTask]);

  async function handleRemovedBoardLabel(labelId) {
    try {
      await deleteBoardLabel(labelId);

      setBoardLabels((prevLabels) =>
        prevLabels.filter((label) => label.id !== labelId)
      );

      setColumns((columns) =>
        columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) => ({
            ...task,
            labels: task.labels.filter((label) => label.id !== labelId),
          })),
        }))
      );
    } catch (error) {
      console.log("Failed to remove board label:", error);
    }
  }

  async function handleRemovedTaskLabel(taskId, labelId) {
    try {
      await deleteTaskLabel(taskId, labelId);
      setColumns((columns) =>
        columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  labels: task.labels.filter((label) => label.id !== labelId),
                }
              : task
          ),
        }))
      );
    } catch (error) {
      console.error("Failed to delete label from task: ", error);
    }
  }

  async function handleAddedTaskLabel(taskId, label) {
    try {
      await addTaskLabel(taskId, label.id);
      setColumns((columns) =>
        columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  labels: [...(task.labels || []), label],
                }
              : task
          ),
        }))
      );
    } catch (error) {
      console.error("Failed to add label to task: ", error);
    }
  }

  async function handleAddedBoardLabel(label) {
    try {
      const boardLabelData = await addBoardLabel(id, label);
      setBoardLabels([...boardLabels, boardLabelData]);
    } catch (error) {
      console.error("Failed to add board label");
    }
  }

  function handleDeleteMember(memberId) {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== memberId)
    );
  }

  function handleUpdatedMemberRole(boardMemberId, role) {
    setMembers(
      members.map((member) =>
        member.id === boardMemberId ? { ...member, role: role } : member
      )
    );
  }

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

  const handleArchiveTask = (taskId, columnId) => {
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

  const handleUpdatedTaskTitle = (title, taskId, columnId) => {
    setColumns((columns) =>
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId ? { ...task, title: title } : task
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

  function handleInvitedUser(invitedUser) {
    setMembers([...members, invitedUser]);
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
    <div className="board-page">
      <BoardHeader
        boardName={currentBoard.name}
        members={members}
        onInviteModalOpened={() => {
          setShowInviteModal(true);
        }}
        onMenuOpened={() => setIsMenuOpened(true)}
      />
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
              boardLabels={boardLabels}
              task={clickedTask}
              column={clickedTaskColumn}
              onAddedBoardLabel={handleAddedBoardLabel}
              onAddedTaskLabel={handleAddedTaskLabel}
              onRemovedTaskLabel={handleRemovedTaskLabel}
              onRemovedBoardLabel={handleRemovedBoardLabel}
              onTaskDeleted={handleDeleteTask}
              onTaskArchived={handleArchiveTask}
              onTaskTitleUpdated={handleUpdatedTaskTitle}
              isOpen={isTaskModalOpen}
              onClose={() => setIsTaskModalOpen(false)}
            ></TaskModal>
          </div>
        </div>
      </DragDropContext>

      {showInviteModal && (
        <InviteModal
          boardId={id}
          onClosed={() => setShowInviteModal(false)}
          onUserInvited={handleInvitedUser}
        />
      )}
      {isMenuOpened && (
        <BoardMenu
          board={currentBoard}
          members={members}
          currentUser={currentUser}
          onClose={() => setIsMenuOpened(false)}
          onUpdateMemberRole={handleUpdatedMemberRole}
          onDeleteBoardMember={handleDeleteMember}
        />
      )}
    </div>
  );
}
