🎮 Jogo 2048 — JavaScript

Implementação completa do clássico jogo 2048, desenvolvida do zero utilizando JavaScript puro, com foco em lógica de jogo, organização de código e boas práticas de frontend.

[Jogue aqui](https://igor-hrm.github.io/js_2048_game/)

Sobre o Projeto:

Este projeto recria fielmente a mecânica do jogo 2048, incluindo movimentação das peças, regras de fusão, cálculo de pontuação, detecção de vitória e derrota, além de controle via teclado.

O principal objetivo foi praticar JavaScript moderno, Programação Orientada a Objetos (OOP) e a separação entre lógica de negócio e interface do usuário.

Funcionalidades:

 - Gameplay clássico em tabuleiro 4×4
 - Controle por teclado (setas direcionais)
 - Movimentação e fusão correta das peças
 - Sistema de pontuação baseado nas fusões
 - Detecção de vitória ao alcançar o valor 2048
 - Detecção de Game Over quando não há mais movimentos possíveis
 - Botão de iniciar
 - Botão de reiniciar o jogo
 - Geração aleatória de peças (90% chance de 2, 10% chance de 4)
 - Separação clara entre lógica do jogo e interface

Tecnologias Utilizadas:

JavaScript (ES6+)
  - HTML5
  - SCSS
  - ES Modules
  - Programação Orientada a Objetos (Classes)
  - ESLint + Prettier
  - GitHub Pages (deploy)

Arquitetura do Projeto:

O projeto é dividido em duas partes principais:

1️- Lógica do Jogo
Localizada em:

src/modules/Game.class.js

Responsabilidades:

Gerenciar o estado do jogo
Controlar os movimentos (moveLeft, moveRight, moveUp, moveDown)
Aplicar as regras de fusão das peças
Controlar a pontuação
Detectar estados de vitória e fim de jogo

2️- Interface do Usuário

Localizada em:

src/index.html
src/scripts/main.js

Responsabilidades:

Renderizar o tabuleiro
Escutar eventos do teclado
Atualizar o DOM conforme o estado do jogo
Controlar botões e mensagens da interface

Regras do Jogo:

O tabuleiro possui tamanho 4 × 4
Cada célula pode conter:
0 (vazia)
ou uma potência de 2 (2, 4, 8, 16, ...)
A cada movimento:
As peças deslizam na direção escolhida
Peças iguais se fundem
Uma peça só pode se fundir uma vez por movimento
Após cada movimento válido:
Uma nova peça (2 ou 4) aparece em uma célula vazia aleatória

O jogo termina quando:

🏆 Vitória: uma peça atinge o valor 2048
💀 Game Over: não há mais movimentos possíveis

Instalação e Execução Local
# Clone o repositório
git clone https://github.com/Igor-hrm/js_2048_game.git
# Instale as dependências
npm install
# Execute o projeto
npm start

Testes
# Executar todos os testes
npm run test

# Executar testes sem o linter
npm run test:only -- -n

# Executar testes com saída detalhada
npm run test:only -- -l

📌 O que foi praticado neste projeto

Lógica em JavaScript
Manipulação de arrays
Gerenciamento de estado
Programação Orientada a Objetos
Código limpo e organizado
Padronização com ESLint e Prettier
Deploy de aplicações frontend

Autor:

Igor Rocha
Desenvolvedor Frontend
GitHub: https://github.com/Igor-hrm
