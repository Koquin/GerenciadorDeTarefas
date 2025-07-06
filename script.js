let idTarefa = 1;
let tarefas = [];

document.getElementById("adicionarBtn").addEventListener("click", function () {
    const descricao = document.getElementById("descricaoTarefa").value.trim();
    if (descricao === "") {
        alert("Por favor, digite a descrição da tarefa.");
        return;
    }

    const prioridade = document.getElementById("prioridadeTarefa").value;
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const novaTarefa = {
        id: idTarefa++,
        descricao: descricao,
        prioridade: prioridade,
        dataInicio: dataAtual,
        dataConclusao: ""
    };
    tarefas.push(novaTarefa);

    const tabela = document.getElementById("tabelaTarefas").getElementsByTagName("tbody")[0];
    const novaLinha = tabela.insertRow();

    const celulaId = novaLinha.insertCell(0);
    const celulaDescricao = novaLinha.insertCell(1);
    const celulaPrioridade = novaLinha.insertCell(2);
    const celulaInicio = novaLinha.insertCell(3);
    const celulaConclusao = novaLinha.insertCell(4);
    const celulaAcoes = novaLinha.insertCell(5);

    celulaId.textContent = novaTarefa.id;
    celulaDescricao.textContent = novaTarefa.descricao;
    celulaPrioridade.textContent = novaTarefa.prioridade.charAt(0).toUpperCase() + novaTarefa.prioridade.slice(1);
    celulaPrioridade.classList.add(`prioridade-${novaTarefa.prioridade}`);
    celulaInicio.textContent = novaTarefa.dataInicio;
    celulaConclusao.textContent = novaTarefa.dataConclusao;

    const btnConcluir = document.createElement("button");
    btnConcluir.textContent = "Concluir";
    btnConcluir.classList.add("concluirBtn");
    btnConcluir.addEventListener("click", function () {
        const tarefaConcluida = tarefas.find(t => t.id === novaTarefa.id);
        if (tarefaConcluida && tarefaConcluida.dataConclusao === "") {
            const dataConclusao = new Date().toLocaleDateString('pt-BR');
            celulaConclusao.textContent = dataConclusao;
            tarefaConcluida.dataConclusao = dataConclusao;
            btnConcluir.style.display = 'none';
            btnReabrir.style.display = 'inline-block';
        } else if (tarefaConcluida) {
            alert("Esta tarefa já foi concluída.");
        }
    });

    const btnReabrir = document.createElement("button");
    btnReabrir.textContent = "Reabrir";
    btnReabrir.classList.add("reabrirBtn");
    btnReabrir.style.display = 'none';
    btnReabrir.addEventListener("click", function () {
        const tarefaReabrir = tarefas.find(t => t.id === novaTarefa.id);
        if (tarefaReabrir && tarefaReabrir.dataConclusao !== "") {
            celulaConclusao.textContent = "";
            tarefaReabrir.dataConclusao = "";
            btnReabrir.style.display = 'none';
            btnConcluir.style.display = 'inline-block';
        }
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("excluirBtn");
    btnExcluir.addEventListener("click", function () {
        const tarefaParaExcluir = tarefas.find(t => t.id === novaTarefa.id);
        if (tarefaParaExcluir && tarefaParaExcluir.dataConclusao !== "") {
            alert("Não é possível excluir tarefas já concluídas.");
            return;
        }

        if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
            tabela.removeChild(novaLinha);
            tarefas = tarefas.filter(t => t.id !== novaTarefa.id);
        }
    });

    celulaAcoes.appendChild(btnConcluir);
    celulaAcoes.appendChild(btnReabrir);
    celulaAcoes.appendChild(btnExcluir);

    document.getElementById("descricaoTarefa").value = "";
});

document.getElementById("excluirTodasBtn").addEventListener("click", function() {
    const temConcluidas = tarefas.some(tarefa => tarefa.dataConclusao !== "");
    
    if (temConcluidas) {
        alert("Não é possível excluir todas as tarefas enquanto houver tarefas concluídas.");
        return;
    }
    
    if (tarefas.length === 0) {
        alert("Não há tarefas para excluir.");
        return;
    }
    
    if (confirm("Tem certeza que deseja excluir TODAS as tarefas?")) {
        tarefas = [];
        const tabela = document.getElementById("tabelaTarefas").getElementsByTagName("tbody")[0];
        tabela.innerHTML = "";
    }
});

document.getElementById("reabrirTodasBtn").addEventListener("click", function() {
    const temConcluidas = tarefas.some(tarefa => tarefa.dataConclusao !== "");
    
    if (!temConcluidas) {
        alert("Não há tarefas concluídas para reabrir.");
        return;
    }
    
    if (confirm("Tem certeza que deseja reabrir TODAS as tarefas concluídas?")) {
        tarefas.forEach(tarefa => {
            if (tarefa.dataConclusao !== "") {
                tarefa.dataConclusao = "";
            }
        });
        
        const linhas = document.getElementById("tabelaTarefas").getElementsByTagName("tbody")[0].rows;
        
        for (let i = 0; i < linhas.length; i++) {
            const celulaConclusao = linhas[i].cells[4];
            const botoesAcoes = linhas[i].cells[5];
            
            if (celulaConclusao.textContent !== "") {
                celulaConclusao.textContent = "";
                
                const btnConcluir = botoesAcoes.querySelector('.concluirBtn');
                const btnReabrir = botoesAcoes.querySelector('.reabrirBtn');
                
                if (btnConcluir) btnConcluir.style.display = 'inline-block';
                if (btnReabrir) btnReabrir.style.display = 'none';
            }
        }
    }
});

document.getElementById("concluirTodasBtn").addEventListener("click", function() {
    const temPendentes = tarefas.some(tarefa => tarefa.dataConclusao === "");
    
    if (!temPendentes) {
        alert("Não há tarefas pendentes para concluir.");
        return;
    }
    
    if (confirm("Tem certeza que deseja concluir TODAS as tarefas pendentes?")) {
        const dataConclusao = new Date().toLocaleDateString('pt-BR');
        
        tarefas.forEach(tarefa => {
            if (tarefa.dataConclusao === "") {
                tarefa.dataConclusao = dataConclusao;
            }
        });
        
        const linhas = document.getElementById("tabelaTarefas").getElementsByTagName("tbody")[0].rows;
        
        for (let i = 0; i < linhas.length; i++) {
            const celulaConclusao = linhas[i].cells[4];
            const botoesAcoes = linhas[i].cells[5];
            
            if (celulaConclusao.textContent === "") {
                celulaConclusao.textContent = dataConclusao;
                
                const btnConcluir = botoesAcoes.querySelector('.concluirBtn');
                const btnReabrir = botoesAcoes.querySelector('.reabrirBtn');
                
                if (btnConcluir) btnConcluir.style.display = 'none';
                if (btnReabrir) btnReabrir.style.display = 'inline-block';
            }
        }
    }
});

document.getElementById("filtroPrioridade").addEventListener("change", function() {
    const prioridade = this.value;
    const linhas = document.getElementById("tabelaTarefas").getElementsByTagName("tbody")[0].rows;
    
    for (let i = 0; i < linhas.length; i++) {
        const celulaPrioridade = linhas[i].cells[2];
        const prioridadeTarefa = celulaPrioridade.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        if (prioridade === "" || prioridadeTarefa === prioridade.toLowerCase()) {
            linhas[i].style.display = "";
        } else {
            linhas[i].style.display = "none";
        }
    }
});