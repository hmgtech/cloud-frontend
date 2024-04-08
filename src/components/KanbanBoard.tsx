import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState, useEffect } from "react";
import { Board, Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
// import { Redirect } from 'react-router-dom'; // Add this line
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard({ boards, onUpdateTitle }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [board, setBoard] = useState<Board | null>(null);


  useEffect(() => {
    // fetchBoard();
    // if (boards.length > 0) {
    const initialBoard = boards; // Assuming you're only dealing with the first board for simplicity
    setColumns(initialBoard.columns);
    setTasks(initialBoard.tasks);
    setBoard({
      id: String(initialBoard.id),
      title: initialBoard.title,
    });
    // }
  }, [boards]);

  useEffect(() => {
    if (board) {
      updateBoard(board.id, { columns, tasks }, board.title);
    }
  }, [columns, tasks, board]);


  // const fetchBoard = () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     window.location.href = '/login';
  //     return;
  //   }
  //   const headers = {
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   };

  //   fetch("http://3.89.195.15/get_boards", {
  //     method: 'GET',
  //     headers: headers
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data && data.length > 0) {
  //         const boardData = data[0];
  //         setColumns(boardData.columns);
  //         setTasks(boardData.tasks);
  //         setBoard({
  //           id: String(boardData.id),
  //           title: boardData.title,
  //         });
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  // };



  const updateBoard = (boardId: Id, updatedData: { columns: Column[]; tasks: Task[]; }, boardTitle: String) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    fetch(`http://3.89.195.15/update_board`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        boardId,
        board: updatedData,
        boardTitle
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update board");
        }
        console.log(updatedData);

        console.log("Board updated successfully");
      })
      .catch((error) => console.error("Error updating board:", error));
  };


  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
        m-auto
        flex
        flex-col
        min-h-screen
        h-80vh
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        h-80vh
    "
    >
      {/* <h1 className="text-3xl font-bold mb-1 mt-12">{board?.title}</h1> */}
      <input
        className="border border-purple-500 rounded-md mb-1 px-3 py-2 placeholder-gray-400 text-lg text-black text-center focus:outline-none focus:border-purple-500"
        style={{ backgroundColor: 'transparent', marginTop: "50px" }}
        placeholder={board?.title}
        defaultValue={board?.title}
        onChange={(e) => updateTitle(e.target.value)}
      />
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="m-auto flex gap-4"
          style={{ marginTop: "30px", marginBottom: "0px" }}>
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="
              h-[60px]
              w-[350px]
              min-w-[350px]
              cursor-pointer
              rounded-lg
              bg-mainBackgroundColor
              border-2
              border-columnBackgroundColor
              p-4
              ring-rose-500
              hover:ring-2
              flex
              gap-2
            "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => (task.id !== id ? task : { ...task, content }));
    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => (col.id !== id ? col : { ...col, title }));
    setColumns(newColumns);
  }


  function updateTitle(newValue: string) {
    if (board) {
      setBoard({
        ...board,
        title: newValue
      });
      onUpdateTitle(newValue);
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (!isActiveATask) return;
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
