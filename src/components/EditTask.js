import CrossIcon from "../icons/Cross";
import {useState} from "react";

function EditTask({task, updateTask, closeEdit}) {

    const [isEditable, setIsEditable] = useState(task.name === 'New Task');
    function handleUpdateTask(){
        const updatedTaskName= document.getElementById('task-name').value;
        const updatedTaskDesc= document.getElementById('task-description').value;
        setIsEditable(false);
        updateTask(task.id, updatedTaskName, updatedTaskDesc);
    }

    return (
        <div
            className="bg-columnBackgroundColor absolute inset-60 border-2 border-rose-500 p-10 rounded-2xl white flex flex-col justify-center">
            <div className="h-[30px] w-[30px] relative top-0 left-0 stroke-white hover:stroke-rose-500 cursor-pointer self-end" onClick={closeEdit}>
                <CrossIcon/>
            </div>
            <div className="flex gap-20 items-center h-1/2">
                Name
                <textarea autoFocus disabled={!isEditable} rows={1} id="task-name" defaultValue={task.name === 'New Task' ? "" : task.name}
                          className="bg-transparent border-b-[1px] focus:border-b-rose-500 outline-none resize-none self-center w-[200px] disabled:cursor-text disabled:border-none"/>
            </div>
            <div className="flex gap-10 items-center h-1/2">
                Description
                <textarea disabled={!isEditable} rows={1} id="task-description" defaultValue={task.description}
                          className="bg-transparent border-b-[1px] focus:border-b-2 focus:border-b-rose-500 outline-none resize-none self-center w-[500px] disabled:cursor-text disabled:border-none"/>
            </div>
            <div className="flex self-end gap-10">
                <button className="self-end px-7 py-2 border rounded-2xl bg-rose-500 hover:bg-rose-700 box-border hover:shadow-2xl hover:shadow-rose-500/30 -mb-2" onClick={()=>setIsEditable(true)}>
                    Edit
                </button>
                <button className="self-end px-7 py-2 border rounded-2xl bg-rose-500 hover:bg-rose-700 box-border hover:shadow-2xl hover:shadow-rose-500/30 -mb-2" onClick={handleUpdateTask}>
                    Done
                </button>
            </div>
        </div>
    )
}

export default EditTask;