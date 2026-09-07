import React, { useState, useEffect } from "react";
import DoneImage from "./DoneImage";
import DeleteImage from "./DeleteImage";
import EditImage from "./EditImage";
import Checker from "./Checker";
import { Check, Plus } from "lucide-react";

function Row({ item, index, handleDelete, dayName, onEditClick, onUpdateItem }) {
    const [isCompleted, setIsCompleted] = useState(item.completed || false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isAddSet, setIsAddSet] = useState(false);

    const [newReps, setNewReps] = useState("");
    const [newWeight, setNewWeight] = useState("");

    // Store the initial sets from the template as "previous" reference
    const prevSetsRef = React.useRef(item.sets ? JSON.parse(JSON.stringify(item.sets)) : []);

    useEffect(() => {
        setIsCompleted(item.completed || false);
    }, [item]);

    const deleteClass = (isDeleted ? 'delete hide' : 'delete');
    const doneClass = (isCompleted ? 'done hide' : 'done');
    const checkerClass = (isCompleted ? 'checker-list hide' : 'checker-list');

    const handleComplete = async () => {
        //Optimistic UI
        const previousState = isCompleted;
        setIsCompleted(!isCompleted);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                method: 'PUT',
                body: JSON.stringify({name: item.exerciseName, intent: "COMPLETE_WORKOUT"}),
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) {
                throw new Error("Backend response not ok");
            }

            const { workout } = await response.json();
            setIsCompleted(workout.completed);
        }
        catch (err) {
            console.log('Error while updating row!', err);
            setIsCompleted(previousState);
        }
    }

    function onDelete(workoutName) {
        handleDelete(workoutName);
        setIsDeleted(true);
    }

    const saveSetsToBackend = async (updatedSets) => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: item.exerciseName, 
                    intent: "EDIT_WORKOUT",
                    sets: updatedSets
                }),
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error("Failed to save sets", error);
        }
    };

    const handleSetChange = (idx, field, value) => {
        const newSets = [...item.sets];
        newSets[idx] = { ...newSets[idx], [field]: Number(value) };
        onUpdateItem({ ...item, sets: newSets });
        // We can optionally debounce the saveSetsToBackend here, but saving on Check or Add is safer to avoid spam.
    };

    const toggleSetComplete = async (idx) => {
        const newSets = [...item.sets];
        newSets[idx].completed = !newSets[idx].completed;
        onUpdateItem({ ...item, sets: newSets });
        await saveSetsToBackend(newSets);
    };

    const handleAddSetSubmit = async () => {
        if (!newReps || !newWeight) return;
        const newSet = { reps: Number(newReps), weight: Number(newWeight), completed: false };
        const updatedSets = [...(item.sets || []), newSet];
        onUpdateItem({ ...item, sets: updatedSets });
        setIsAddSet(false);
        setNewReps("");
        setNewWeight("");
        await saveSetsToBackend(updatedSets);
    };

    const finalClassName = `rows ${isCompleted ? 'row-completed' : ''} ${isDeleted ? 'deleted' : ''}`;

    return (
        <tr className={finalClassName}>
            <td className='serial'>{index + 1}</td>
            <td className='name-table'>
                <span className="text-lg">{item.exerciseName}</span>
                <div className={`mt-2 text-sm text-gray-300 w-full overflow-hidden transition-all duration-300 ${isCompleted ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                    {item.sets && item.sets.map((set, idx) => {
                        const prevSet = prevSetsRef.current[idx];
                        return (
                            <div key={idx} className={`flex gap-3 border-t border-slate-700/50 py-2 items-center ${set.completed ? 'bg-green-900/20' : ''}`}>
                                <span className="w-10 text-gray-400 font-medium text-xs">Set {idx + 1}</span>
                                
                                <span className="w-20 text-[0.65rem] text-slate-500 leading-tight">
                                    {prevSet ? `Prev: ${prevSet.weight}kg x ${prevSet.reps}` : 'New Set'}
                                </span>
                                
                                <input 
                                    type="number" 
                                    value={set.reps || ""} 
                                    onChange={(e) => handleSetChange(idx, 'reps', e.target.value)}
                                    className="w-14 p-1 bg-slate-900 border border-slate-700 rounded text-white text-xs outline-none focus:border-blue-500"
                                    disabled={set.completed}
                                />
                                <span className="text-xs text-gray-500">reps</span>
                                
                                <input 
                                    type="number" 
                                    value={set.weight || ""} 
                                    onChange={(e) => handleSetChange(idx, 'weight', e.target.value)}
                                    className="w-14 p-1 bg-slate-900 border border-slate-700 rounded text-white text-xs outline-none focus:border-blue-500"
                                    disabled={set.completed}
                                />
                                <span className="text-xs text-gray-500">kg</span>
                                
                                <button 
                                    onClick={() => toggleSetComplete(idx)}
                                    className={`ml-auto rounded-md p-1 transition-colors cursor-pointer ${set.completed ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-gray-400'}`}
                                >
                                    <Check size={14} />
                                </button>
                            </div>
                        );
                    })}
                    
                    {isAddSet && (
                        <div className="flex gap-2 mt-2 items-center bg-slate-800/50 p-2 rounded-lg">
                            <input type="number" placeholder="Reps" value={newReps} onChange={e => setNewReps(e.target.value)} className="w-16 p-1 bg-slate-900 border border-slate-700 rounded text-white text-sm outline-none focus:border-blue-500" />
                            <input type="number" placeholder="Weight" value={newWeight} onChange={e => setNewWeight(e.target.value)} className="w-16 p-1 bg-slate-900 border border-slate-700 rounded text-white text-sm outline-none focus:border-blue-500" />
                            <span className="text-xs text-gray-400 mr-2">kg</span>
                            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs text-white transition-colors" onClick={handleAddSetSubmit}>Save</button>
                            <button className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-xs text-white transition-colors" onClick={() => setIsAddSet(false)}>Cancel</button>
                        </div>
                    )}
                </div>
            </td>
            <td className='sets-table font-semibold text-xl text-slate-300'>{item.sets?.length || 0}</td>
            <td className="drag-handle-table drag-handle text-slate-500" style={{cursor: "grab"}}>☰</td>
            <td className="separator-cell"></td>
            
            {/* Action cell handles completing, deleting, editing */}
            <td className='action-cell'>
                <button className="border border-slate-600 bg-slate-800/50 hover:bg-slate-700 rounded-md cursor-pointer p-1 transition-colors" onClick={() => setIsAddSet(!isAddSet)}>
                    <Plus className='w-5 h-5 text-blue-400'></Plus>
                </button>
                <Check className={doneClass} onClick={() => setIsCompleted(true)} onCheckFunc={handleComplete} />
                <DeleteImage className={deleteClass} onDelFunc={() => onDelete(item.exerciseName)} />
                <EditImage className="edit-row" onClickFunc={onEditClick} />
            </td>
        </tr>
    );
}
export default Row