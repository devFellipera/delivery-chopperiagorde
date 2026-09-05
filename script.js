// TOGGLE - INFO / PAGAMENTOS
function toggle(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.classList.toggle("hidden");

}
// ================== TOGGLE BOX ==================
function toggle(id){
  let el = document.getElementById(id);
  el.classList.toggle('hidden');
}

// ================== SLIDER ==================
let slides = document.querySelectorAll('.slide');
let dots = document.querySelectorAll('.dot');
let index = 0;

function mostrarSlide(i){
  if(slides.length === 0) return;

  slides.forEach(s => s.classList.remove('active'));
  if(dots.length) dots.forEach(d => d.classList.remove('active'));

  slides[i].classList.add('active');
  if(dots.length) dots[i].classList.add('active');
}

function trocarSlide(){
  if(slides.length === 0) return;

  index = (index + 1) % slides.length;
  mostrarSlide(index);
}

function irSlide(i){
  index = i;
  mostrarSlide(index);
}

// AUTO SLIDE
setInterval(trocarSlide, 2000);

// RODA SEMPRE QUE ABRIR A PÁGINA
document.addEventListener("DOMContentLoaded", function () {
  atualizarCarrinhoFloat();
});

// =====================================================
// FORMATAR PREÇO
// =====================================================

function formatarPreco(valor) {

    return Number(valor)
        .toFixed(2)
        .replace(".", ",");

}
// =====================================================
// STATUS AUTOMÁTICO DA CHOPPERIA
// =====================================================

function atualizarStatusLoja() {

    const status = document.getElementById("statusLoja");

    if (!status) {
        return;
    }

    const agora = new Date();

    const dia = agora.getDay(); 
    // 0 = Domingo
    // 1 = Segunda
    // 2 = Terça
    // 3 = Quarta
    // 4 = Quinta
    // 5 = Sexta
    // 6 = Sábado

    const hora = agora.getHours();
    const minuto = agora.getMinutes();

    const minutosAgora = hora * 60 + minuto;

    let aberto = false;


    // ================================================
    // TERÇA, QUARTA E QUINTA
    // 14:00 às 22:00
    // ================================================

    if (dia >= 2 && dia <= 4) {

        if (
            minutosAgora >= 14 * 60 &&
            minutosAgora < 22 * 60
        ) {
            aberto = true;
        }

    }


    // ================================================
    // SEXTA
    // 14:00 até 02:00
    // ================================================

    if (dia === 5) {

        if (minutosAgora >= 14 * 60) {
            aberto = true;
        }

    }


    // ================================================
    // SÁBADO
    // 00:00 até 02:00
    // OU
    // 14:00 até 00:00
    // ================================================

    if (dia === 6) {

        if (
            minutosAgora < 2 * 60 ||
            minutosAgora >= 14 * 60
        ) {
            aberto = true;
        }

    }


    // ================================================
    // DOMINGO
    // 00:00 até 02:00
    // OU
    // 14:00 até 00:00
    // ================================================

    if (dia === 0) {

        if (
            minutosAgora < 2 * 60 ||
            minutosAgora >= 14 * 60
        ) {
            aberto = true;
        }

    }


    // ================================================
    // SEGUNDA DE MADRUGADA
    // 00:00 até 02:00
    // referente ao domingo
    // ================================================

    if (dia === 1) {

        if (minutosAgora < 2 * 60) {
            aberto = true;
        }

    }


    // ================================================
    // MOSTRAR STATUS
    // ================================================

    if (aberto) {

        status.textContent = "● ABERTO";
        status.className = "status aberto";

    } else {

        status.textContent = "● FECHADO";
        status.className = "status fechado";

    }

}
document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarBotoes();

        atualizarCarrinho();

        atualizarMiniCarrinho();

        atualizarStatusLoja();

    }
);

// =====================================================
// CARRINHO
// =====================================================

let cesta = JSON.parse(localStorage.getItem("cesta")) || [];

// =====================================================
// SALVAR CESTA
// =====================================================

function salvarCesta() {

    localStorage.setItem(
        "cesta",
        JSON.stringify(cesta)
    );

}

// =====================================================
// ADICIONAR PRODUTO
// =====================================================

function adicionarCesta(event, nome, preco) {

    event.preventDefault();
    event.stopPropagation();

    let produto = cesta.find(
        item => item.nome === nome
    );

    if (produto) {

        produto.quantidade++;

    } else {

        cesta.push({

            nome: nome,
            preco: preco,
            quantidade: 1

        });

    }

    salvarCesta();

    atualizarBotoes();
    atualizarCarrinho();
    atualizarMiniCarrinho();

}

// =====================================================
// AUMENTAR PRODUTO
// =====================================================

function aumentarProduto(nome) {

    let produto = cesta.find(
        item => item.nome === nome
    );

    if (produto) {

        produto.quantidade++;

    }

    salvarCesta();

    atualizarBotoes();
    atualizarCarrinho();
    atualizarMiniCarrinho();

}

// =====================================================
// DIMINUIR PRODUTO
// =====================================================

function diminuirProduto(nome) {

    let index = cesta.findIndex(
        item => item.nome === nome
    );

    if (index === -1) {
        return;
    }

    cesta[index].quantidade--;

    if (cesta[index].quantidade <= 0) {

        cesta.splice(index, 1);

    }

    salvarCesta();

    atualizarBotoes();
    atualizarCarrinho();
    atualizarMiniCarrinho();

}

// =====================================================
// REMOVER PRODUTO
// =====================================================

function removerProduto(nome) {

    cesta = cesta.filter(
        item => item.nome !== nome
    );

    salvarCesta();

    atualizarBotoes();
    atualizarCarrinho();
    atualizarMiniCarrinho();

}

// =====================================================
// ATUALIZAR BOTÕES DOS PRODUTOS
// =====================================================

function atualizarBotoes() {

    document
        .querySelectorAll(".btn-add")
        .forEach(botao => {

            let onclick =
                botao.getAttribute("onclick");

            if (!onclick) {
                return;
            }

            let produtoEncontrado =
                cesta.find(item =>
                    onclick.includes(
                        "'" + item.nome + "'"
                    )
                );

            if (produtoEncontrado) {

                botao.innerHTML =
                    produtoEncontrado.quantidade;

            } else {

                botao.innerHTML = "+";

            }

        });

}

// =====================================================
// ATUALIZAR CARRINHO FLUTUANTE
// =====================================================

function atualizarCarrinho() {

    const carrinho =
        document.getElementById("carrinhoFloat");

    const contador =
        document.getElementById("qtd-carrinho");

    if (!carrinho || !contador) {
        return;
    }

    let quantidadeTotal = 0;

    cesta.forEach(produto => {

        quantidadeTotal +=
            produto.quantidade;

    });

    contador.textContent =
        quantidadeTotal;

    if (quantidadeTotal > 0) {

        carrinho.classList.remove("hidden");

    } else {

        carrinho.classList.add("hidden");

    }

}

// =====================================================
// ABRIR MINI CARRINHO
// =====================================================

function abrirMiniCarrinho() {

    if (cesta.length === 0) {

        alert("Sua cesta está vazia!");

        return;

    }

    const miniCarrinho =
        document.getElementById("miniCarrinho");

    if (!miniCarrinho) {
        return;
    }

    miniCarrinho.classList.remove("hidden");

    document.body.classList.add("carrinho-aberto");

    atualizarMiniCarrinho();

}

// =====================================================
// FECHAR MINI CARRINHO
// =====================================================

function fecharMiniCarrinho() {

    const miniCarrinho =
        document.getElementById("miniCarrinho");

    if (!miniCarrinho) {
        return;
    }

    miniCarrinho.classList.add("hidden");

    document.body.classList.remove("carrinho-aberto");

}

// =====================================================
// ATUALIZAR MINI CARRINHO
// =====================================================

function atualizarMiniCarrinho() {

    const lista =
        document.getElementById("miniLista");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (cesta.length === 0) {

        lista.innerHTML = `
            <div class="cesta-vazia">
                <p>🛒 Sua cesta está vazia.</p>
                <small>Adicione algum produto para continuar.</small>
            </div>
        `;

        fecharMiniCarrinho();

        return;
    }

    // =================================================
    // PRODUTOS
    // =================================================

    cesta.forEach(produto => {

        const subtotal =
            produto.preco *
            produto.quantidade;

        const item =
            document.createElement("div");

        item.className =
            "mini-item";

        item.innerHTML = `

            <div class="mini-info">

                <strong>
                    ${produto.nome}
                </strong>

                <span>
                    R$ ${produto.preco
                        .toFixed(2)
                        .replace(".", ",")}
                    cada
                </span>

            </div>


            <div class="mini-controles">

                <button
                    class="btn-qtd"
                    onclick="diminuirProduto('${produto.nome}')">
                    −
                </button>

                <span class="quantidade">
                    ${produto.quantidade}
                </span>

                <button
                    class="btn-qtd"
                    onclick="aumentarProduto('${produto.nome}')">
                    +
                </button>

                <button
                    class="btn-remover"
                    onclick="removerProduto('${produto.nome}')">
                    🗑️
                </button>

            </div>


            <div class="mini-subtotal">

                R$ ${subtotal
                    .toFixed(2)
                    .replace(".", ",")}

            </div>

        `;

        lista.appendChild(item);

    });


    // =================================================
    // TOTAL
    // =================================================

    let total = 0;

    cesta.forEach(produto => {

        total +=
            produto.preco *
            produto.quantidade;

    });

    const totalElemento =
        document.createElement("div");

    totalElemento.className =
        "mini-total";

    totalElemento.innerHTML = `

        <span>Total do pedido</span>

        <strong>
            R$ ${total
                .toFixed(2)
                .replace(".", ",")}
        </strong>

    `;

    lista.appendChild(totalElemento);

}


// =====================================================
// FINALIZAR PEDIDO
// =====================================================

function irFinalizar() {

    if (cesta.length === 0) {

        alert("Sua cesta está vazia!");

        return;

    }

    window.location.href =
        "finalizar.html";

}


// =====================================================
// PAGAMENTOS / INFO
// =====================================================

function toggle(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.classList.toggle("hidden");

}

// =====================================================
// FECHAR MINI CARRINHO CLICANDO FORA
// =====================================================

document.addEventListener(
    "click",
    function(event) {

        const miniCarrinho =
            document.getElementById("miniCarrinho");

        const conteudo =
            document.querySelector(
                ".mini-carrinho-conteudo"
            );

        const carrinho =
            document.getElementById("carrinhoFloat");


        if (
            miniCarrinho &&
            !miniCarrinho.classList.contains("hidden") &&
            event.target === miniCarrinho
        ) {

            fecharMiniCarrinho();

        }

    }
);

function escolherEnergetico(event, nome) {

    event.preventDefault();
    event.stopPropagation();

    const sabor = prompt(
        "Escolha o sabor do energetico:\n\n" +
        "1 - Redbull Cereja\n" +
        "2 - Redbull Morango com Pêssego\n" +
        "3 - Redbull Tropical\n" +
        "4 - Redbull Melancia"
        
    );

    if (sabor === null) {
        return;
    }

    const sabores = {
        "1": "Redbull Cereja",
        "2": "Redbull Morango com Pêssego",
        "3": "Redbull Tropical",
        "4": "Redbull Melancia"
    };

    if (!sabores[sabor]) {

        alert("Escolha uma opção válida.");

        return;
    }

    const saborEscolhido = sabores[sabor];

    const nomeCompleto =
        nome + " + Red Bull " + saborEscolhido;


    const produtoExistente = cesta.find(
        item => item.nome === nomeCompleto
    );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        cesta.push({

            nome: nomeCompleto,

            preco: Number(preco),

            quantidade: 1

        });

    }


    salvarCesta();

    atualizarCarrinho();

    atualizarMiniCarrinho();

    alert(
        "✅ Adicionado ao carrinho!\n\n" +
        nomeCompleto
    );
}




// =====================================================
// ATUALIZAR STATUS AUTOMATICAMENTE
// =====================================================

// Atualiza a cada 30 segundos

setInterval(
    atualizarStatusLoja,
    30000
);





