import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useState} from "react";
import TrashIcon from "../icons/Trash";

function Task({task, onTaskClick, handleOnDeleteTask}) {

    const [showDelete, setShowDelete] = useState(false);
    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        }
    });

    function onDelete(event){
        event.stopPropagation();
        handleOnDeleteTask(task.id)
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    if(isDragging){
        return <div ref={setNodeRef}  style={style}  className=" bg-mainBackgroundColor p-3 h-[80px] ring-rose-500 ring-2 hover:ring-2
                    cursor-pointer flex justify-between items-center rounded-2xl opacity-40"></div>
    }

    return <div ref={setNodeRef} {...attributes} {...listeners} className="
                    bg-mainBackgroundColor p-3 h-[80px] ring-rose-500 hover:ring-2
                    cursor-pointer flex justify-between items-center rounded-2xl" style={style} onClick={()=>onTaskClick(task.id)} onMouseOver={()=> setShowDelete(true)} onMouseLeave={()=>setShowDelete(false)}>
            {task.name}
        {showDelete && <div id="del-btn" className="h-[22px] w-[22px] stroke-gray-500 hover:stroke-rose-400 cursor-pointer" onClick={onDelete}><TrashIcon/></div>}
    </div>
}

export default Task;