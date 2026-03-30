class TaskManager {
    constructor() {
        // Load tasks from local browser storage, or start empty
        this.tasks = JSON.parse(localStorage.getItem('eliteTasks')) || [];
        
        // DOM Elements
        this.formContainer = document.getElementById('task-form-container');
        this.taskForm = document.getElementById('task-form');
        this.taskList = document.getElementById('task-list');
        this.completedCount = document.getElementById('completed-count');
        
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Toggle Form
        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.formContainer.classList.toggle('hidden');
        });

        // Submit Form
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filters
        document.querySelectorAll('.filters li').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.filters li').forEach(li => li.classList.remove('active'));
                e.target.classList.add('active');
                this.render(e.target.dataset.filter);
            });
        });
    }

    addTask() {
        const title = document.getElementById('task-title').value;
        const priority = document.getElementById('task-priority').value;
        const category = document.getElementById('task-category').value;
        const date = document.getElementById('task-date').value;

        const newTask = {
            id: Date.now().toString(),
            title,
            priority,
            category,
            date,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveData();
        this.taskForm.reset();
        this.formContainer.classList.add('hidden');
        this.render();
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveData();
        this.render();
    }

    saveData() {
        // Save strictly to local browser storage
        localStorage.setItem('eliteTasks', JSON.stringify(this.tasks));
    }

    render(filter = 'all') {
        this.taskList.innerHTML = '';
        let filteredTasks = this.tasks;

        if (filter === 'high') {
            filteredTasks = this.tasks.filter(t => t.priority === 'high');
        } else if (filter === 'work' || filter === 'personal') {
            filteredTasks = this.tasks.filter(t => t.category === filter);
        }

        let completed = 0;

        filteredTasks.forEach(task => {
            if(task.completed) completed++;
            
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;
            taskEl.innerHTML = `
                <div class="task-details">
                    <h3>${task.title}</h3>
                    <div class="task-meta">
                        <span>Tag: ${task.category}</span>
                        <span>Due: ${task.date || 'No date'}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-complete" onclick="app.toggleComplete('${task.id}')">✔</button>
                    <button class="btn-delete" onclick="app.deleteTask('${task.id}')">✖</button>
                </div>
            `;
            this.taskList.appendChild(taskEl);
        });

        this.completedCount.innerText = this.tasks.filter(t => t.completed).length;
    }
}

// Initialize the app globally so inline onclick handlers can access it
const app = new TaskManager();