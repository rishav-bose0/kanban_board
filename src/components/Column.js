import TrashIcon from "../icons/Trash";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useMemo, useState} from "react";
import AddTasks from "../icons/Add";
import Task from "./Task";
import {DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";

function Column({colDetail, onDelete, setColumnName, taskList, addTask, editTask, deleteTask}) {

    const [isEdit, setIsEdit] = useState(false);

    const tasksId = useMemo(() => taskList.map((task) => task.id), [taskList]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // This means we need to move it by 3px for all column listeners sortable to kick in
            },
        })
    );

    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: colDetail.id,
        data: {
            type: "Column",
            colDetail
        },
        disabled: isEdit,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    if (isDragging) {
        return <div ref={setNodeRef} style={style}
                    className="bg-columnBackgroundColor h-[800px] w-[400px] rounded-2xl rounded-t-none border-2 border-rose-500 opacity-40"></div>
    }

    function handleNameClick() {
        setIsEdit(true);
    }

    function handleNameChange(event) {
        console.log(event.key);
        if (event.key === "Enter") {
            setColumnName(colDetail.id, document.getElementById('col-name').value);
            setIsEdit(false);
        }
    }

    return <div ref={setNodeRef} style={style}
                className="bg-columnBackgroundColor h-[800px] w-[400px] rounded-2xl rounded-t-none overflow-y-auto overflow-x-hidden">
        <div {...attributes} {...listeners}
             className="bg-mainBackgroundColor p-4 flex justify-between items-center w-[390px] m-auto">
            {!isEdit &&
                <div className="flex gap-2 items-center" onClick={handleNameClick}>
                    <div className="rounded-full bg-columnBackgroundColor p-1">
                        {taskList.length}
                    </div>
                    <div className="hover:cursor-text">
                        {colDetail.name}
                    </div>
                </div>
            }
            {
                isEdit &&
                <div className="flex gap-2 items-center">
                    <div className="rounded-full bg-columnBackgroundColor p-1">
                        0
                    </div>
                    <input id="col-name" type="text"
                           className="bg-black outline-none focus:border-rose-500 border rounded" autoFocus
                           onKeyDown={handleNameChange}/>
                </div>
            }
            <div className="h-[22px] w-[22px] stroke-gray-500 hover:stroke-white cursor-pointer"
                 onClick={() => onDelete(colDetail.id)}>
                <TrashIcon/>
            </div>
        </div>
        <div
            className="h-[50px] w-[50px] stroke-gray-500 hover:stroke-white cursor-pointer relative top-[670px] left-[335px]"
            onClick={() => addTask(colDetail.id)}>
            <AddTasks/>
        </div>

        <div className="flex flex-col gap-3 w-[390px] m-auto -mt-9">
            <SortableContext items={tasksId}>
                {taskList.map((task) => {
                    return <Task key={task.id} task={task} onTaskClick={editTask} handleOnDeleteTask={deleteTask}/>
                })}
            </SortableContext>
        </div>
    </div>
}

export default Column;