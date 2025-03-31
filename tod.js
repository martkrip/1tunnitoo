//ChatGPT promptide jaoks eeldata, et kopeerisin kogu koodi siit ja panin sinna.
console.log("fail ühendatud")

class Entry{
    constructor(title, description, date, priority = 1){ //ChatGPT - "How do i make a 3 stage based priority system?" (pani prioriteedile = 1)

        
        this.title= title;
        this.description = description;
        this.date = date;
        this.done = false;
        this.priority = priority;
        this.isEditing = false;
    }

}



class FormatDate {
    
}
// on klassis tehtud, et oleks paremini kaitstud (ei tea miks?)
class Todo{
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.render();
        document.querySelector("#addButton").addEventListener("click", () => {this.addEntry()})
    }
    // ChatGPT - "How do i make DD.MM.YYYY format show up on the task?" -> "Does toLocaleDateString() work too?"
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }


    addEntry(){
        console.log("vajutasin nuppu");
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue)); 

        console.log(this.entries);

        this.save();
    }

    render(){
        let tasklist = document.querySelector("#tasklist");
        tasklist.innerHTML = "";
        
        // ChatGPT - "How do i sort tasks by date?""
        this.entries.sort((a,b) => new Date(a.date) - new Date (b.date));

        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        doneUl.className = "todo-list";
        ul.className = "todo-list";

        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            const priority1Button = document.createElement("button");
            const priority2Button = document.createElement("button");
            const priority3Button = document.createElement("button");

            doneButton.innerText = "✓";
            deleteButton.innerText = "x";
            editButton.innerText = "edit";
            priority1Button.innerText = "priority1";    
            priority2Button.innerText = "priority2";
            priority3Button.innerText = "priority3";

            buttonDiv.className = "button-container";
            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";
            priority1Button.className = "priority1";
            priority2Button.className = "priority2";
            priority3Button.className = "priority3";

            deleteButton.addEventListener("click", ()=>{
                this.entries.splice(entryIndex, 1);
                this.save();
                this.render();
            });

            doneButton.addEventListener("click", ()=>{
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done = false;
                } else{
                    this.entries[entryIndex].done = true;
                }
                this.save();
                this.render();
            })
            // ChatGPT - "How do i make a 3 stage based priority system?" algus 
            priority1Button.addEventListener("click", ()=>{
                entryValue.priority = 1;
                this.save();
                this.render(); // ChatGPT - "In local storage it is visible that the priority changes, however the background color stays the same"
            });

            priority2Button.addEventListener("click", ()=>{
                entryValue.priority = 2;
                this.save();
                this.render();
            });

            priority3Button.addEventListener("click", ()=>{
                entryValue.priority = 3
                this.save();
                this.render()
            });
            switch (entryValue.priority) {
                case 1:
                    div.classList.remove("medium-priority", "high-priority"); // ChatGPT prompt - Why is the background color for priorities still not working?
                    div.classList.add("low-priority");
                    break;
                case 2:
                    div.classList.remove("low-priority", "high-priority");
                    div.classList.add("medium-priority");
                    break;
                case 3:
                    div.classList.remove("low-priority", "medium-priority");
                    div.classList.add("high-priority");
                    break;
            }
            console.log(div.className)
            // ChatGPT - "How do i make a 3 stage based priority system?" lõpp
            

            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else{
                ul.appendChild(li);
            }

            editButton.addEventListener("click", ()=>{
                this.entries[entryIndex].isEditing = !this.entries[entryIndex].isEditing
                this.save()
            })

            // nüüd oleks vaja eraldi panna innerHTML kui on vaja editida taski
            // võtsin ChatGPT-lt promptiga niimoodi, et kopeerisin ülemist koodi ja kirjutasin "im trying to make an edit option next to a task but i don't know how to make it work"
            if (entryValue.isEditing) { 
                div.innerHTML = `
                <input type="text" class="edit-title" value="${entryValue.title}" />
                <input type="text" class="edit-description" value="${entryValue.description}" />
                <input type="date" class="edit-date" value="${entryValue.date}" />`;
            
            // Add event listeners to save the changes
            div.querySelector(".edit-title").addEventListener("input", (e) => {
            entryValue.title = e.target.value;
            });
            
            div.querySelector(".edit-description").addEventListener("input", (e) => {
            entryValue.description = e.target.value;
            });
            
            div.querySelector(".edit-date").addEventListener("input", (e) => {
            entryValue.date = e.target.value;
            });
        } else {
            div.innerHTML = `<div> tekst ${entryIndex + 1}
            </div><div>${entryValue.title}
            </div><div>${entryValue.description}
            </div><div>${this.formatDate(entryValue.date)}`; // FormatDatei jaoks kasutasin ChatGPT promptiga "How do i make DD.MM.YYYY format show up on the task?" -> "Does toLocaleDateString() work too?" 
        } // siit kohast lõppes Chat-GPT prompt
            div.className = "task";
            ul.appendChild(li);
            li.appendChild(div);
            li.appendChild(buttonDiv)
            buttonDiv.appendChild(deleteButton);
            li.appendChild(doneButton);
            li.appendChild(editButton);
            li.appendChild(priority1Button);
            li.appendChild(priority2Button);
            li.appendChild(priority3Button);

        });

        tasklist.appendChild(taskHeading)
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl)
    }

    save(){
        localStorage.setItem("entries", JSON.stringify(this.entries))
        this.render()
    }
}

const todo = new Todo(); // teeme uue rakendusi ja võtame seda mis üleval on