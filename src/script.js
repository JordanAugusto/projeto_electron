//Decretando variaveis
var listaRegistros = {
    ultimoIdGerado:0,
    usuario:[]
}

var FILTRO = ''

// Armazenando dados

const KEY_BD = '@emailsusinas' //encrementando um key

var listaRegistros = { //varias do banco 
    ultimoIdGerado:0,
    usuario:[]
}

function guardadados(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerdados(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    renderizar()
}

//Mostrando tabela - Renderizando

function renderizar(){
    const tbody = document.getElementById('listaRegistroBody')

    if(tbody){
        var data = listaRegistros.usuario;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`) //programando filtro
            data = data.filter(usuario => {
                return expReg.test( usuario.nome) || expReg.test(usuario.email)
            })
        }

        data = data
            .sort((a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>
                                <button onclick='show("cadastro",false,${usuario.id})'>Atualizar</button>
                                <button class='vermelho' onclick='deletequestion(${usuario.id})'>Deletar</button>
                            </td>
                        </tr>`
            })
        tbody.innerHTML = data.join('')    
    }
}

//Comandos........................

function insertemail(nome, email){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuario.push({
        id, nome, email
    })
    guardadados()
    renderizar()
    show('lista')
}

function editemail(id,nome,email){
    var usuario = listaRegistros.usuario.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.email = email;
    guardadados()
    renderizar()
    show('lista')
}

function deleteemail(id){
    listaRegistros.usuario = listaRegistros.usuario.filter(usuario =>{
        return usuario.id != id
    })
    guardadados()
    renderizar()
}

function deletequestion(id){ // solicitando autorizaçao para exclusao   
    if(confirm('Deseja excluir a Usina?')){
        deleteemail(id)
        agregar()
    }
}

function procurar(value){
    FILTRO = value;
    renderizar()
}

//limpar area - novo cadastro
function limparcampo(){ 
    document.getElementById('nome').value = ''
    document.getElementById('email').value = ''
} 

//Atualizar paginas e autofocus
function show(pagina, novo=false, id=null){
    document.body.setAttribute('page', pagina)

    if(pagina === 'cadastro'){
        if(novo) limparcampo()
        if(id){
            const usuario = listaRegistros.usuario.find( usuario => usuario.id == id )

            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('email').value = usuario.email
            }
        }
        document.getElementById('nome').focus()
    }
}

function agregar(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
    }
    if(data.id){
        editemail(data.id, data.nome, data.email)
    }else{
        insertemail(data.nome, data.email)
    }
}

window.addEventListener('load' , () => {
    lerdados()
    document.getElementById('cadastroregistros').addEventListener('submit', agregar)
    document.getElementById('procurar').addEventListener('keyup', e =>{
        procurar(e.target.value)
    })
})