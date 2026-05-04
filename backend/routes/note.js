const express = require("express");
const router = express.Router();
const Note = require("../models/Note")
const fetchuser = require("../middleware/fetchuser")

router.get("/fetchAllNotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }
})
router.post("/addNote", fetchuser, async (req, res) => {
    try {

        const { title, description, tag } = req.body
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }
})
router.put("/updateNote/:id", fetchuser, async (req, res) => {
   const {title, description, tag} =  req.body;
   try{
   //create a new note
  const newNote = {}
  if(title){newNote.title = title}
  if(description){newNote.description = description}
  if(tag){newNote.tag = tag}

  let note = await Note.findById(req.params.id);
  if(!note){
    return res.status(404).send("Not found")
  }
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not allowed")
  }
  note =await  Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new: true})
  res.json({note})
  }
    catch (error) {
        console.error(error.message)
        res.status(500).send({error: "some error occured"});
    }
})

router.delete("/deleteNote/:id", fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({ error: "Not found" });
        if(note.user.toString() !== req.user.id)
            return res.status(401).json({ error: "Not allowed" });

        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Some error occurred" });
    }
});

module.exports = router;