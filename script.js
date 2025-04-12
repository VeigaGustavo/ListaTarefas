// Classe principal que gerencia as tarefas
class Tarefas {
    constructor() {
        // Seleciona os elementos das colunas de tarefas
        this.divFazer = document.querySelector("#div_fazer .tarefas");
        this.divFazendo = document.querySelector("#div_fazendo .tarefas");
        this.divFeito = document.querySelector("#div_feito .tarefas");
        
        // Inicializa o objeto que armazena as tarefas por status
        this.tarefas = {
            fazer: [],
            fazendo: [],
            feito: []
        };

        // Configura os eventos de drag and drop
        this.setupDragAndDrop();
    }

    // Configura os eventos de drag and drop para as colunas e tarefas
    setupDragAndDrop() {
        const columns = [this.divFazer, this.divFazendo, this.divFeito];
        
        // Adiciona eventos de drag and drop para cada coluna
        columns.forEach(column => {
            // Evento quando uma tarefa é arrastada sobre a coluna
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.classList.add('drag-over');
            });

            // Evento quando uma tarefa sai da área da coluna
            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over');
            });

            // Evento quando uma tarefa é solta na coluna
            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');
                
                // Obtém o ID da tarefa e o novo status da coluna
                const taskId = e.dataTransfer.getData('text/plain');
                const newStatus = column.parentElement.id.split('_')[1];
                this.moverTarefa(taskId, newStatus);
            });
        });

        // Adiciona eventos globais para o drag and drop das tarefas
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('tarefa')) {
                e.target.classList.add('dragging');
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('tarefa')) {
                e.target.classList.remove('dragging');
            }
        });
    }

    // Cria uma nova tarefa
    criarTarefa() {
        const input = document.getElementById("new");
        const texto = input.value.trim();
        
        if (texto) {
            // Cria um objeto de tarefa com ID único baseado no timestamp
            const novaTarefa = {
                id: Date.now().toString(),
                nome: texto,
                status: 'fazer'
            };
            
            // Adiciona a tarefa à lista e atualiza a interface
            this.tarefas.fazer.push(novaTarefa);
            this.mostrar();
            input.value = '';
        }
    }

    // Move uma tarefa para um novo status
    moverTarefa(taskId, novoStatus) {
        // Procura a tarefa em todos os status possíveis
        for (const status of ['fazer', 'fazendo', 'feito']) {
            const index = this.tarefas[status].findIndex(t => t.id === taskId);
            if (index !== -1) {
                // Remove a tarefa do status atual
                const tarefa = this.tarefas[status][index];
                this.tarefas[status].splice(index, 1);
                // Atualiza o status e adiciona ao novo status
                tarefa.status = novoStatus;
                this.tarefas[novoStatus].push(tarefa);
                this.mostrar();
                break;
            }
        }
    }

    // Exclui uma tarefa
    excluirTarefa(taskId) {
        // Procura a tarefa em todos os status possíveis
        for (const status of ['fazer', 'fazendo', 'feito']) {
            const index = this.tarefas[status].findIndex(t => t.id === taskId);
            if (index !== -1) {
                // Remove a tarefa e atualiza a interface
                this.tarefas[status].splice(index, 1);
                this.mostrar();
                break;
            }
        }
    }

    // Atualiza a interface mostrando todas as tarefas
    mostrar() {
        // Atualiza o conteúdo HTML de cada coluna
        this.divFazer.innerHTML = this.tarefas.fazer.map(tarefa => this.criarElementoTarefa(tarefa)).join('');
        this.divFazendo.innerHTML = this.tarefas.fazendo.map(tarefa => this.criarElementoTarefa(tarefa)).join('');
        this.divFeito.innerHTML = this.tarefas.feito.map(tarefa => this.criarElementoTarefa(tarefa)).join('');
    }

    // Cria o HTML de uma tarefa individual
    criarElementoTarefa(tarefa) {
        return `
            <div class="tarefa" 
                 id="${tarefa.id}" 
                 draggable="true"
                 ondragstart="event.dataTransfer.setData('text/plain', '${tarefa.id}')">
                <p>${tarefa.nome}</p>
                <button onclick="obj.excluirTarefa('${tarefa.id}')" class="delete-btn">×</button>
            </div>
        `;
    }
}

// Cria uma instância da classe Tarefas
const obj = new Tarefas();