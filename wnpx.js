import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// --- Sua Configuração do Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyB9GkSqTIZ0kbVsba_WOdQeVAETrF9qna0",
    authDomain: "wzzm-ce3fc.firebaseapp.com",
    projectId: "wzzm-ce3fc",
    storageBucket: "wzzm-ce3fc.appspot.com",
    messagingSenderId: "249427877153",
    appId: "1:249427877153:web:0e4297294794a5aadeb260",
    measurementId: "G-PLKNZNFCQ8"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para buscar e exibir os fóruns
async function carregarFóruns() {
    const container = document.getElementById('container-explorador');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    try {
        // 1. Busca todas as pastas (gavetas)
        const qPastas = query(collection(db, "forumwzzm"), where("isPasta", "==", true));
        const querySnapshotPastas = await getDocs(qPastas);

        querySnapshotPastas.forEach(async (docPasta) => {
            const dadosPasta = docPasta.data();
            const pastaUID = docPasta.id;

            // Cria o elemento HTML para a pasta
            const divPasta = document.createElement('div');
            divPasta.classList.add('pasta-forum');
            divPasta.innerHTML = `
                <h2>${dadosPasta.titulo}</h2>
                <p>${dadosPasta.descricao}</p>
                <div class="lista-foruns-vinculados" id="lista-${pastaUID}">
                    </div>
            `;
            container.appendChild(divPasta);

            // 2. Busca os fóruns vinculados a esta pasta
            const qForuns = query(collection(db, "forumwzzm"), where("uidForumPastaVinculado", "==", pastaUID));
            const querySnapshotForuns = await getDocs(qForuns);

            const listaForuns = document.getElementById(`lista-${pastaUID}`);

            if (querySnapshotForuns.empty) {
                listaForuns.innerHTML = '<p>Nenhum fórum encontrado nesta pasta.</p>';
            } else {
                querySnapshotForuns.forEach((docForum) => {
                    const dadosForum = docForum.data();

                    // Cria o elemento HTML para cada fórum
                    const divForum = document.createElement('div');
                    divForum.classList.add('item-forum');
                    divForum.innerHTML = `
                        <h3>${dadosForum.titulo}</h3>
                        <p>Descrição: ${dadosForum.descricaoForum}</p>
                        <div class="area-comentarios">
                            <p>Área de comentários do fórum ${dadosForum.titulo}...</p>
                        </div>
                        <hr>
                    `;
                    listaForuns.appendChild(divForum);
                });
            }
        });

    } catch (error) {
        console.error("Erro ao carregar os fóruns: ", error);
        container.innerHTML = '<p>Erro ao carregar os fóruns. Tente novamente mais tarde.</p>';
    }
}

// Chame a função para carregar os fóruns quando a página carregar
window.addEventListener('load', carregarFóruns);
