const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = JSON.parse(localStorage.getItem("quicknotes_notes")) || [];

function saveNotes() {
  localStorage.setItem("quicknotes_notes", JSON.stringify(notes));
}

function render() {
  notesList.innerHTML = "";
  errorMessage.textContent = "";

  const searchTerm = searchInput.value.toLowerCase();
  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(searchTerm)
  );

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }

  if (filteredNotes.length === 0 && notes.length > 0) {
    const li = document.createElement("li");
    li.textContent = "No notes match your search.";
    notesList.appendChild(li);
    return;
  }

  filteredNotes.forEach(note => {
    const li = document.createElement("li");
    li.className = `note-card category-${note.category.toLowerCase()}`;

    const headerDiv = document.createElement("div");
    headerDiv.className = "note-header";

    const catSpan = document.createElement("span");
    catSpan.textContent = note.category;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = note.createdAt;

    headerDiv.appendChild(catSpan);
    headerDiv.appendChild(dateSpan);

    const textP = document.createElement("p");
    textP.textContent = note.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(headerDiv);
    li.appendChild(textP);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });
}

function addNote(event) {
  event.preventDefault();
  const text = noteInput.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(newNote);
  saveNotes();
  render();

  noteInput.value = "";
  noteCategory.value = "Personal";
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render();
}

noteForm.addEventListener("submit", addNote);
searchInput.addEventListener("input", render);

render();