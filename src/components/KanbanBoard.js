import {useMemo, useState} from "react";
import Column from "./Column";
import PlusIcon from "../icons/Plus";
import {DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import Task from "./Task";
import EditTask from "./EditTask";

function KanbanBoard() {

    const [columns, setColumns] = useState([]);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const [tasks, setTasks] = useState([]);

    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    const [isEditTask, setIsEditTask] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // This means we need to move it by 3px for all column listeners sortable to kick in
            },
        })
    );

    function handleSetColumnName(columnId, columnName) {
        setColumns(columns.map((col) => {
                if (col.id === columnId) {
                    return {...col, name: columnName};
                }
                return col;
            }
        ));
    }

    function handleOnDelete(columnId) {
        setColumns(columns.filter((col) => {
                return col.id !== columnId
            }
        ));
    }

    function handleOnDeleteTask(taskId) {
        setTasks(tasks.filter((task) => {
                return task.id !== taskId
            }
        ));
    }

    function handleAddColumn() {
        setColumns([...columns, {
            id: uniqueIdGenerator(),
            name: `New Column`,
        }
        ]);
    }

    function handleAddTask(columnId) {
        setTasks([...tasks, {
            id: uniqueIdGenerator(),
            name: `New Task`,
            description: '',
            columnId: columnId
        }]);
    }

    function openModal(taskId) {
        console.log(taskId);
        const selectedTask = tasks.filter((task) => task.id === taskId);
        setIsEditTask(selectedTask[0]);
    }

    function handleCloseEdit(){
        setIsEditTask(null);
    }

    function handleUpdateTask(taskId, updatedTaskName, updatedTaskDescription){
        setIsEditTask(null);
        setTasks(tasks.map((task) => {
                if (task.id === taskId) {
                    return {...task, name: updatedTaskName, description: updatedTaskDescription};
                }
                return task;
            }
        ));
    }

    function uniqueIdGenerator() {
        return Math.floor(Math.random() * 10001);
    }

    function handleOnDragStart(event) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.colDetail);
        }

        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
        }
    }

    function handleOnDragEnd(event) {
        setActiveColumn(null);
        setActiveTask(null);


        const {active, over} = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns((cols) => {
            const activeColumnIndex = cols.findIndex((col) => col.id === activeColumnId);

            const overColumnIndex = cols.findIndex((col) => col.id === overColumnId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })

    }

    function handleDragOver(event) {
        const {active, over} = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (!isActiveATask) return;

        //     drop Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);

                const overTaskIndex = tasks.findIndex((task) => task.id === overId);

                // This swaps the indexes.
                return arrayMove(tasks, activeTaskIndex, overTaskIndex);
            });
        }

        //     drop Task over another Column
        const isOverAColumn = over.data.current?.type === 'Column';
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
                tasks[activeTaskIndex].columnId = overId;

                // This is to rerender of the tasks.
                return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
            });
        }
    }

    return <>
        <div className="flex gap-10 mt-3">
            <DndContext sensors={sensors} onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}
                        onDragOver={handleDragOver}>
                <div className="flex gap-10">

                    <SortableContext items={columnsId}>
                        {columns.map((col) => {
                            return <Column key={col.id} colDetail={col} onDelete={handleOnDelete}
                                           setColumnName={handleSetColumnName}
                                           taskList={tasks.filter((task) => task.columnId === col.id)}
                                           addTask={handleAddTask} editTask={openModal}
                                           deleteTask={handleOnDeleteTask}></Column>
                        })}
                    </SortableContext>

                </div>
                <div className="cursor-pointer">
                    <button className="bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 rounded-lg h-[60px] w-[300px] min-w-[300px] cursor-pointer ring-rose-500 hover:ring-2 flex items-center gap-5
                " onClick={handleAddColumn}>
                        <div className="h-[30px] w-[30px]">
                            <PlusIcon/>
                        </div>
                        Add Column
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn &&
                            <Column key={activeColumn.id} colDetail={activeColumn} onDelete={handleOnDelete}
                                    setColumnName={handleSetColumnName}
                                    taskList={tasks.filter((task) => task.columnId === activeColumn.id)}
                                    addTask={handleAddTask} editTask={openModal} deleteTask={handleOnDeleteTask}/>
                        }
                        {activeTask &&
                            <Task task={activeTask} handleOnDeleteTask={handleOnDeleteTask}
                                  onTaskClick={openModal}/>
                        }
                    </DragOverlay>, document.body)
                }
            </DndContext>
        </div>
        {isEditTask &&
            <>
                <div className="bg-mainBackgroundColor absolute top-0 right-0 h-screen w-screen opacity-60">
                </div>
                <EditTask task={isEditTask} updateTask={handleUpdateTask} closeEdit={handleCloseEdit}/>
            </>
        }
    </>
}

export default KanbanBoard;