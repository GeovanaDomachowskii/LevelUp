# Level Up

API de gamificação para estudantes: o estudante conclui missões, ganha XP, sobe de nível, mantém uma sequência de dias (streak), libera conquistas e disputa rankings.

## Identificação
- **Projeto:** Level Up
- **Disciplina:** Desenvolvimento de Software Visual
- **Curso:** Ciência da Computação, Universidade Positivo
- **Integrantes:** Geovana Domachowski, Miguel Brugnolo, Julia prestes e Jean Lucas.

## Resumo do projeto
Estudar sozinho costuma desmotivar. O Level Up transforma o estudo em um jogo: cada estudante cumpre missões, ganha XP (com bônus por dias seguidos e XP em dobro na missão do dia), sobe de nível, recebe um título (Calouro, Estagiário, Dev Jr, Dev Pleno e Lenda), libera conquistas e aparece nos rankings geral, semanal e por curso. Não há prêmio em dinheiro, só reconhecimento. A solução é uma API em C# (.NET 8, Minimal API) com Entity Framework Core e banco SQLite.

## Repositório
https://github.com/GeovanaDomachowskii/LevelUp

## Como executar
Pré-requisito: .NET SDK 8 instalado.

```
git clone https://github.com/GeovanaDomachowskii/LevelUp.git
cd LevelUp
dotnet restore
dotnet tool restore
cd API
dotnet ef database update
cd ..
dotnet run --project API
```

A API sobe em `http://localhost:5262`. Os arquivos de teste (`.http`) estão em `API/Tests` e podem ser executados com a extensão REST Client do VS Code.

## Funcionalidades
- **Estudantes:** cadastro (e-mail obrigatório e único), listagem em ordem alfabética, busca por nome, alteração (nome, curso e e-mail) e remoção (bloqueada se o estudante já tem conclusões).
- **Perfil do estudante:** mostra nível, título, XP total, XP que falta para o próximo nível e a sequência de dias (streak).
- **Missões:** cadastro, listagem, filtro por dificuldade (Facil, Media ou Dificil), busca por título, alteração e remoção (bloqueada se a missão já foi concluída).
- **Missão do dia:** sorteio de uma missão que vale XP em dobro e consulta de qual é a missão do dia.
- **Conclusão de missão:** registra o XP ganho com bônus de streak (x1,10 com 3 dias seguidos ou mais e x1,25 com 7 ou mais), XP em dobro na missão do dia, recálculo de nível e título, e proteção contra concluir a mesma missão duas vezes no mesmo dia.
- **Histórico de conclusões:** geral e por estudante, com os dados do estudante e da missão.
- **Rankings:** geral (por XP total), semanal (XP dos últimos 7 dias) e por curso.
- **Conquistas:** cadastro, listagem, busca, alteração e remoção, e consulta das conquistas liberadas por estudante (por XP, streak ou número de missões).
- **Missões mais concluídas** e **resumo geral** (totais de estudantes, missões e conclusões e XP distribuído).

## Descrição das funcionalidades

### Estudantes
Cada estudante tem nome, curso, e-mail, XP total, nível, sequência de dias (streak) e a data da última atividade. O cadastro (`POST /api/estudante/cadastrar`) exige nome e e-mail e não aceita e-mail repetido. É possível listar em ordem alfabética (`GET /api/estudante/listar`), buscar por parte do nome (`GET /api/estudante/buscar/{nome}`), alterar nome, curso e e-mail (`PUT /api/estudante/alterar/{id}`) e remover (`DELETE /api/estudante/remover/{id}`), mas a remoção é bloqueada se o estudante já tem conclusões, para não perder o histórico. O perfil (`GET /api/estudante/perfil/{id}`) mostra nível, título, XP total, XP que falta para o próximo nível e o streak.

### Missões
Cada missão tem título, descrição, XP, dificuldade (Facil, Media ou Dificil) e a marca de missão do dia. O cadastro (`POST /api/missao/cadastrar`) valida título não vazio e único, XP maior que zero e dificuldade válida. Há listagem (`GET /api/missao/listar`), filtro por dificuldade (`GET /api/missao/listar/dificuldade/{d}`), busca por título (`GET /api/missao/buscar/{titulo}`), alteração (`PUT /api/missao/alterar/{id}`) e remoção (`DELETE /api/missao/remover/{id}`), bloqueada se a missão já foi concluída. A rota `GET /api/missao/mais-concluidas` mostra as 5 missões mais concluídas.

### Missão do dia
`PUT /api/missao/sortear-do-dia` escolhe uma missão ao acaso e marca como a do dia, desmarcando a anterior (só pode haver uma). `GET /api/missao/do-dia` mostra qual é, ou 404 se ainda não houve sorteio. A missão do dia vale o **dobro de XP**.

### Conclusão de missão
`POST /api/conclusao/registrar` recebe o estudante e a missão. O sistema confirma que os dois existem e impede concluir a mesma missão duas vezes no mesmo dia. Calcula o **streak**: primeira atividade vale 1; concluir no dia seguinte soma 1; pular dois dias ou mais volta para 1; no mesmo dia mantém. O XP ganho é o XP da missão multiplicado pelo bônus de streak (x1,10 com 3 dias ou mais, x1,25 com 7 dias ou mais) e pelo dobro da missão do dia. O XP é somado ao total, o **nível** é recalculado (nível = XP total dividido por 100, mais 1) e a resposta mostra o título: Calouro (níveis 1 e 2), Estagiário (3 e 4), Dev Jr (5 a 7), Dev Pleno (8 a 10) e Lenda (11 ou mais).

### Histórico
`GET /api/conclusao/listar` mostra todas as conclusões, da mais recente para a mais antiga, com os dados do estudante e da missão. `GET /api/conclusao/estudante/{id}` mostra só as de um estudante.

### Rankings
`GET /api/ranking/geral` lista os 10 estudantes com mais XP total. `GET /api/ranking/semanal` soma o XP ganho nos últimos 7 dias. `GET /api/ranking/curso/{curso}` mostra o ranking de um curso.

### Conquistas
Cada conquista tem nome, descrição, tipo (`xp`, `streak` ou `missoes`) e um valor mínimo. Há cadastro (nome único, tipo válido e valor maior que zero), listagem, busca por nome, alteração e remoção. `GET /api/conquista/estudante/{estudanteId}` mostra as conquistas liberadas por um estudante: por XP total, por streak ou pelo número de missões concluídas.

### Resumo geral
`GET /api/relatorio/resumo` mostra os totais do sistema: estudantes, missões, conclusões, XP distribuído, conclusões na semana e a missão mais concluída.

### Revisões realizadas pela equipe
- Cada trabalho virou um **Pull Request revisado por outro integrante** antes de entrar na `main`.
