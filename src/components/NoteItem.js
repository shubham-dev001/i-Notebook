import React,{useContext} from 'react'
import NoteContext from '../context/notes/NoteContext'

const NoteItem = (props) => {
    const {showAlert} = props;
     const context = useContext(NoteContext)
     const{deleteNote} = context;
     const { note, updateNote } = props; 
    return (
        <div className='col-md-4'>
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description} 
                        </p>
                       <i className="fa-solid fa-trash-can mx-1" onClick={() => { deleteNote(note._id);showAlert("delete successfully", "success")}}></i>
                         <i className="far fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>

                </div>
            </div>
        </div>
    )
}

export default NoteItem
