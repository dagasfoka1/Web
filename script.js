class Quarto {
    constructor(numero, tipo, codigo = null, preco, dono = null) {
        this.numero = numero;
        this.tipo = tipo;
        this.codigo = codigo;
        this.preco = preco;
        this.dono = dono
    }
}
class Historico{
    constructor(reserva){
        this.reserva=reserva
    }
}

class Comanda {
    constructor(diaria,frigobar=null,servicos=null){
        this.diaria=diaria
        this.frigobar=frigobar
        this.servicos=servicos
    }
}

class Cliente {
    constructor(nome, endereco, contato, id,senha, dependentes = null) {
        this.nome = nome;
        this.endereco = endereco;
        this.contato = contato;
        this.id = id;
        this.senha = senha
        this.dependentes = dependentes;
    }
}

class Funcionario {
    constructor(nome, endereco, contato, id) {
        this.nome = nome;
        this.endereco = endereco;
        this.contato = contato;
        this.id = id;
    }
}

class Reserva {
    constructor(checkin, checkout, id, numquarto) {
        this.checkin = new Date(checkin)
        this.checkout = new Date(checkout)
        this.id = id
        this.numquarto = numquarto
    }
}
function Encontrar_pessoa(identidade, senha) {
    return lista_clientes.find(cliente => cliente.id === identidade && cliente.senha === senha) || null;
}


function DiffDias(datacheckin,datacheckout){
    let checkin = new Date (datacheckin)
    let checkout = new Date (datacheckout)
    diffmili=checkout-checkin
    diffdias=diffmili/(1000*60*60*24)
}

lista_historico= []
let lista_reservas = []
let lista_clientes = [];
let lista_quartos = { executivo: [], executivo_vista_mar: [], familia: [], praiano: [], premium: [], luxo: [] };
function Cadastro() {
    let lista_dependentes = [];
    let nome = document.getElementById("nome").value;
    let senha = document.getElementById("senha").value
    let endereco = document.getElementById("endereço").value;
    let contato = document.getElementById("contato").value;
    let identidade = document.getElementById("cpf").value;
    if (lista_clientes.some(cliente => cliente.id === identidade && cliente.senha === senha)) {
        alert("O usuário já está cadastrado.")
    } else {
        for (let i = 1; i < (parseInt((document.getElementById("crianca"))) + 1); i++) {
            let dep = [];
            dep.push(identidade);
            dep.push(`${i} crianca`);
            lista_dependentes.push(dep);
        }
        let pessoa = new Cliente(nome, endereco, contato, identidade,senha, lista_dependentes);
        lista_clientes.push(pessoa);
    }
}
function login(){
    let identidade = document.getElementById("cpf").value;
    let senha = document.getElementById("senha").value
    if (lista_clientes.some(cliente => cliente.id === identidade && cliente.senha === senha) ) {
        let cliente_logado = lista_clientes.find(obj => obj.id === identidade) 
        alert(`Entrada com sucesso ${cliente_logado.nome}` )
    }
    else{
        alert("Conta não existente.")
    }
}

for (let i = 1; i <= 50; i++) {
    lista_quartos.executivo.push(new Quarto(i, "executivo", null, 10, null));
    lista_quartos.executivo_vista_mar.push(new Quarto(i, "executivo_vista_mar", null, 12, null));
    lista_quartos.familia.push(new Quarto(i, "familia", null, 7, null));
    lista_quartos.praiano.push(new Quarto(i, "praiano", null, 8, null));
    lista_quartos.premium.push(new Quarto(i, "premium", null, 16, null));
    lista_quartos.luxo.push(new Quarto(i, "luxo", null, 15, null));
}
function Reservar() {
    let quartoDisponivel = false
    let tipo = document.getElementById("tipo").value;
    for (let quarto of lista_quartos[tipo]) {
        if ((quarto.codigo == null)) {
            quarto.codigo = true;
            quarto.dono = document.getElementById("identidade").value;
            let div = document.getElementById("vazia")
            div.innerText = `Quarto ${quarto.numero} reservado.`
            quartoDisponivel = true
            break
        }
    }
    if (quartoDisponivel == false) {
        alert(`Nenhum quarto do tipo ${tipo} está liberado.`)
    }
}
function Disponibilidade() {
    let tipo = document.getElementById("tipo").value;
    for (let quarto of lista_quartos[tipo]) {
        if ((quarto.codigo == null)) {
            let div = document.getElementById("vazia")
            div.innerText = `Quarto ${quarto.numero} está liberado.`
            break
        }
    }
}

let aux // Variável global que armazena o número do quarto disponível; 
        // na hora de rodar o adicionar reserva pensar se o aux deve ser colocado como parâmetro 
        // ou se pode tirar o parâmetro e colocá-lo diretamente na função

function AdicionarReserva() // Função para adicionar uma reserva a um quarto disponível; 
                                                                //tem que trocar os parâmetros por document.getelementbyid
{
    datacheckin=document.getElementById("datacheckin").value
    datacheckout=document.getElementById("datacheckout").value
    dono=document.getElementById("dono").value
    tipo=document.getElementById("tipo").value
    
    // Verifica se há um quarto disponível nas datas e tipo especificados
    if (EstaDisponivel(datacheckin, datacheckout, tipo)) {
        // Cria uma nova reserva com as informações do check-in, check-out, dono e o número do quarto (aux)
        let reserva = new Reserva(datacheckin, datacheckout, dono, aux); // dono é o nome da pessoa ou identidade, 
                                                                         // pq sipa é melhor trabalhar com identidade
        lista_reservas.push(reserva); // Adiciona a nova reserva à lista de reservas
    } else {
        // Exibe um alerta caso não haja quartos disponíveis ou a data seja inválida
        alert("Não há quartos disponíveis nessa data ou você digitou uma data inválida");
    }
}

function EstaDisponivel(datacheckin, datacheckout, tipo) {
    let checkin = new Date(datacheckin); // Converte o check-in para o formato de data
    let checkout = new Date(datacheckout); // Converte o check-out para o formato de data
    let dataHj = new Date(); // Obtém a data atual para comparação com as datas de check-in e check-out

    // Verifica se o check-in ou check-out são datas passadas
    if (checkin < dataHj || checkout < dataHj  || checkout<checkin) {
        return false; // Retorna false se as datas forem inválidas (no passado)
    }

    // Itera sobre todos os quartos do tipo especificado para encontrar um quarto disponível
    for (let quarto of lista_quartos[tipo]) {
        let status = true; // Inicialmente, assume que o quarto está disponível
        // Itera sobre todas as reservas para verificar se há conflito de datas
        for (let reserva of lista_reservas) {
            if (reserva.numquarto === quarto.numero) {// Verifica se a reserva está associada ao número do quarto atual
                if (checkin <= reserva.checkout && checkout >= reserva.checkin) {                // Verifica se as datas de check-in e check-out conflitam com as da reserva existente
                    status = false; // Marca o quarto como indisponível caso haja conflito
                    break; // Sai do loop de reservas para evitar verificações adicionais desnecessárias
                }
            }
        }

        // Se não houve conflito e o quarto está disponível
        if (status) {
            let div = document.getElementById("vazia"); // Seleciona o elemento onde a mensagem será exibida
            div.innerText = `Quarto ${quarto.numero} está liberado.`; // Exibe o número do quarto disponível
            aux = quarto.numero; // Define `aux` como o número do quarto disponível encontrado
            return true; // Retorna true indicando que um quarto disponível foi encontrado
        }
    }

    return false; // Retorna false caso nenhum quarto disponível seja encontrado
}

// ainda é necessario o disponibildiade?
function Retirada(id,numquarto,senha){
    const pessoa= Encontrar_pessoa(identidade,senha)
    for (let reserva of lista_reservas){
        if (reserva.numero == numquarto && reserva.id==id && pessoa.senha==senha){
            lista_historico.push(reserva)
            let index = lista_reservas.findIndex(item => item === reserva);
            if (index !== -1) { // Verifica se o item foi encontrado
                lista.splice(index, 1); // Remove o item no índice encontrado
            }
        }
    }
}
//o checkout realmente existe? porque se voce observar ja que todos os dados da estadia do cliente (quarto,dono,checkin,checkout) estao na reserva e queremos guardar como historico nao podemos excluir esse valor, mas ao mesmo tempo significa que se ele for fazer checkot o tempo ja passou. TIpo se ele aligou até 1 de janeiro, e ele faz checkout 1 de janeiro, ninguem consegue reservar pra antes disso pq ja passou.
//explicações do gpt do codigo que eu fiz, para entende mais vai em correção função javascript
